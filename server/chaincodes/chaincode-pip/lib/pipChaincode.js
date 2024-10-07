'use strict';

const { Contract } = require('fabric-contract-api');

class PIPChaincode extends Contract {

    async initLedger(ctx) {
        console.log('Initializing the PIP ledger with initial user roles');
        const initialUsers = [
            {
                username: 'alice.smith',
                role: ['management', 'admin', 'user']
            },
            {
                username: 'john.doe',
                role: ['admin', 'user']
            },
            {
                username: 'jane.doe',
                role: ['user', 'HR']
            },
            {
                username: 'bob.jones',
                role: ['user', 'overseer']
            },
            {
                username: 'charlie.brown',
                role: ['user', 'organizer']
            },
            {
                username: 'david.white',
                role: ['user', 'owner']
            }
        ];

        for (const user of initialUsers) {
            const attributesKey = `attribute_${user.username}`;
            const roleData = { role: user.role };
            await ctx.stub.putState(attributesKey, Buffer.from(JSON.stringify(roleData)));
            console.log(`Role data for ${user.username} set`);
        }
    }


    async setRole(ctx, username, roles) {
        console.log(`Setting role for ${username}`);
        const attributesKey = `attribute_${username}`;
        const existingData = await ctx.stub.getState(attributesKey);

        if (!existingData || existingData.length === 0) {
            // No existing roles, set new roles
            const roleData = { role: Array.isArray(roles) ? roles : [roles] };
            await ctx.stub.putState(attributesKey, Buffer.from(JSON.stringify(roleData)));
            console.log(`Role set for ${username}`);
            return;
        }

        const roleData = JSON.parse(existingData.toString());
        const existingRoles = new Set(roleData.role); // Convert existing roles to a Set to avoid duplicates

        let newRolesAdded = false;
        (Array.isArray(roles) ? roles : [roles]).forEach(role => {
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
        await ctx.stub.putState(attributesKey, Buffer.from(JSON.stringify(roleData)));
        console.log(`Roles updated for ${username}`);
    }


    async getRole(ctx, username) {
        console.log(`Getting role for ${username}`);
        const attributesKey = `attribute_${username}`;
        const roleData = await ctx.stub.getState(attributesKey);

        if (!roleData || roleData.length === 0) {
            // User does not exist, assign a default "user" role
            console.log(`User ${username} does not exist. Assigning default "user" role.`);
            const defaultRoleData = { role: ['user'] };
            await ctx.stub.putState(attributesKey, Buffer.from(JSON.stringify(defaultRoleData)));
            return JSON.stringify(defaultRoleData);
        }

        return roleData.toString(); // Return the existing roles if found
    }


    async checkUserExists(ctx, username) {
        console.log(`Checking and updating role for user: ${username}`);
        const attributesKey = `attribute_${username}`;
        const userData = await ctx.stub.getState(attributesKey);

        if (!!userData && userData.length > 0) {
            console.log('User already exists in ledger.');
            return 'User already exists, no role added.';
        } else {
            // Since the user doesn't exist, add a default "user" role
            console.log('User does not exist. Adding default "user" role...');
            const roleData = { role: ['user'] };
            await ctx.stub.putState(attributesKey, Buffer.from(JSON.stringify(roleData)));
            console.log(`Default role added for ${username}`);
            return 'User did not exist; default "user" role added.';
        }
    }

    async getAllUsers(ctx) {
        const startKey = 'attribute_';
        const endKey = 'attribute_~'; // '~' is used to cover all possible subsequent characters
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const allUsers = [];

        let result = await iterator.next();
        while (!result.done) {
            const user = JSON.parse(result.value.value.toString());
            const username = result.value.key.split('_')[1];
            allUsers.push({ username, role: user.role });
            result = await iterator.next();
        }
        await iterator.close();

        console.log('All users retrieved from the ledger.');
        return JSON.stringify(allUsers);
    }

    async getUsersByRole(ctx, roleToFind) {
        const startKey = 'attribute_';
        const endKey = 'attribute_~';
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const filteredUsers = [];

        let result = await iterator.next();
        while (!result.done) {
            const user = JSON.parse(result.value.value.toString());
            const username = result.value.key.split('_')[1];
            if (user.role.includes(roleToFind)) {
                filteredUsers.push({ username, role: user.role });
            }
            result = await iterator.next();
        }
        await iterator.close();

        console.log(`All users with role ${roleToFind} retrieved from the ledger.`);
        return JSON.stringify(filteredUsers);
    }



}

module.exports = PIPChaincode;
