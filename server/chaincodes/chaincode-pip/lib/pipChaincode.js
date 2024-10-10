"use strict";

const { Contract } = require("fabric-contract-api");

class PIPChaincode extends Contract {
  async initLedger(ctx) {
    console.log("Initializing the PIP ledger with initial user roles");
    const initialUsers = [
      {
        username: "alice.smith",
        role: ["management", "admin", "user"],
      },
      {
        username: "john.doe",
        role: ["admin", "user"],
      },
      {
        username: "jane.doe",
        role: ["HR"],
      },
      {
        username: "bob.jones",
        role: ["user", "overseer"],
      },
      {
        username: "charlie.brown",
        role: ["user", "organizer"],
      },
      {
        username: "david.white",
        role: ["user", "owner"],
      },
    ];

    for (const user of initialUsers) {
      const attributesKey = `attribute_${user.username}`;
      const roleData = { role: user.role };
      await ctx.stub.putState(
        attributesKey,
        Buffer.from(JSON.stringify(roleData))
      );
      console.log(`Role data for ${user.username} set`);
    }
  }

  async getRole(ctx, username) {
    console.log(`Getting role for ${username}`);
    const attributesKey = `attribute_${username}`;
    const roleDataBytes = await ctx.stub.getState(attributesKey);

    if (!roleDataBytes || roleDataBytes.length === 0) {
      console.log(`User ${username} does not exist.`);
      return JSON.stringify({ error: `User ${username} does not exist.` });
    }

    const roleData = JSON.parse(roleDataBytes.toString());
    return JSON.stringify(roleData);
  }

  async checkUserExists(ctx, username) {
    console.log(`Checking if user ${username} exists`);
    const attributesKey = `attribute_${username}`;
    const userData = await ctx.stub.getState(attributesKey);

    if (!!userData && userData.length > 0) {
      console.log("User already exists in ledger.");
      return JSON.stringify({ exists: true });
    } else {
      // User does not exist
      console.log("User does not exist.");
      return JSON.stringify({ exists: false });
    }
  }

  async setRole(ctx, username, roles) {
    console.log(`Setting role for ${username}`);
    const attributesKey = `attribute_${username}`;
    const existingData = await ctx.stub.getState(attributesKey);

    if (!existingData || existingData.length === 0) {
      // No existing roles, set new roles
      const roleData = { role: Array.isArray(roles) ? roles : [roles] };
      await ctx.stub.putState(
        attributesKey,
        Buffer.from(JSON.stringify(roleData))
      );
      console.log(`Role set for ${username}`);
      return;
    }

    const roleData = JSON.parse(existingData.toString());
    const existingRoles = new Set(roleData.role); // Convert existing roles to a Set to avoid duplicates

    let newRolesAdded = false;
    (Array.isArray(roles) ? roles : [roles]).forEach((role) => {
      if (!existingRoles.has(role)) {
        existingRoles.add(role);
        newRolesAdded = true;
      }
    });

    if (!newRolesAdded) {
      console.log(`No new roles added for ${username} as they already exist.`);
      return "No new roles added as they already exist."; // If no new roles are added, exit the function
    }

    roleData.role = Array.from(existingRoles); // Convert Set back to Array
    await ctx.stub.putState(
      attributesKey,
      Buffer.from(JSON.stringify(roleData))
    );
    console.log(`Roles updated for ${username}`);
  }
  
  // Set default role if the user doesn't exist
  async setDefaultRole(ctx, username, roles) {
    console.log(`Setting role for ${username}`);
    const attributesKey = `attribute_${username}`;
    const roleData = { role: Array.isArray(roles) ? roles : [roles] };
    await ctx.stub.putState(
      attributesKey,
      Buffer.from(JSON.stringify(roleData))
    );
    console.log(`Role set for ${username}`);
    return `Role set for ${username}`;
  }

  async getAllUsers(ctx) {
    const startKey = "attribute_";
    const endKey = "attribute_~"; // '~' is used to cover all possible subsequent characters
    const iterator = await ctx.stub.getStateByRange(startKey, endKey);
    const allUsers = [];

    let result = await iterator.next();
    while (!result.done) {
      const user = JSON.parse(result.value.value.toString());
      const username = result.value.key.split("_")[1];
      allUsers.push({ username, role: user.role });
      result = await iterator.next();
    }
    await iterator.close();

    console.log("All users retrieved from the ledger.");
    return JSON.stringify(allUsers);
  }

  async getUsersByRole(ctx, roleToFind) {
    const startKey = "attribute_";
    const endKey = "attribute_~";
    const iterator = await ctx.stub.getStateByRange(startKey, endKey);
    const filteredUsers = [];

    let result = await iterator.next();
    while (!result.done) {
      const user = JSON.parse(result.value.value.toString());
      const username = result.value.key.split("_")[1];
      if (user.role.includes(roleToFind)) {
        filteredUsers.push({ username, role: user.role });
      }
      result = await iterator.next();
    }
    await iterator.close();

    console.log(`All users with role ${roleToFind} retrieved from the ledger.`);
    return JSON.stringify(filteredUsers);
  }

  async deleteUser(ctx, username) {
    console.log(`Deleting user: ${username}`);
    const attributesKey = `attribute_${username}`;
    const userData = await ctx.stub.getState(attributesKey);

    if (!userData || userData.length === 0) {
      console.log(`User ${username} does not exist.`);
      return `User ${username} does not exist.`;
    }

    await ctx.stub.deleteState(attributesKey); // Deletes the user from the ledger
    console.log(`User ${username} deleted from the ledger.`);
    return `User ${username} deleted successfully.`;
  }

  async removeRole(ctx, username, roleToRemove) {
    console.log(`Removing role ${roleToRemove} from user: ${username}`);
    const attributesKey = `attribute_${username}`;
    const existingData = await ctx.stub.getState(attributesKey);

    if (!existingData || existingData.length === 0) {
      console.log(`User ${username} does not exist.`);
      return `User ${username} does not exist.`;
    }

    const roleData = JSON.parse(existingData.toString());
    const existingRoles = new Set(roleData.role); // Convert roles to a Set

    if (!existingRoles.has(roleToRemove)) {
      console.log(`Role ${roleToRemove} not found for user: ${username}`);
      return `Role ${roleToRemove} not found for user: ${username}`;
    }

    existingRoles.delete(roleToRemove); // Remove the specified role

    if (existingRoles.size === 0) {
      console.log(`No roles left for user: ${username}, deleting user.`);
      await ctx.stub.deleteState(attributesKey); // If no roles are left, delete the user
      return `User ${username} deleted as no roles are left.`;
    }

    roleData.role = Array.from(existingRoles); // Convert Set back to Array
    await ctx.stub.putState(
      attributesKey,
      Buffer.from(JSON.stringify(roleData))
    );
    console.log(`Role ${roleToRemove} removed for user: ${username}`);
    return `Role ${roleToRemove} removed successfully for user: ${username}`;
  }
}

module.exports = PIPChaincode;
