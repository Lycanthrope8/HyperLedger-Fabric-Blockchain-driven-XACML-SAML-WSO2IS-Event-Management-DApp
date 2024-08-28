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
                role: ['user']
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
            return '{}'; // Return an empty object in string format if no roles are found
        }
        return roleData.toString(); // Should return JSON object format
    }
}

module.exports = PIPChaincode;
