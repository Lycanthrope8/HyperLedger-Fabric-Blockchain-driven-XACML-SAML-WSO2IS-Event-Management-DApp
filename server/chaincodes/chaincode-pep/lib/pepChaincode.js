'use strict';

const { Contract } = require('fabric-contract-api');

class PEPChaincode extends Contract {

    async enforce(ctx, subject, action, resource) {
        const request = { subject, action, resource };
        console.log(`Enforcing request: ${JSON.stringify(request)}`);
    
        // Define the PDP chaincode name (update this to the actual deployed name)
        const pdpChaincodeName = 'chaincodePDP';
        
        // Define the function name to be called in PDP chaincode
        const functionName = 'evaluate';
        
        // Prepare arguments to pass to the PDP chaincode function
        const args = [JSON.stringify(request)];
    
        try {
            // Invoking the PDP chaincode
            const response = await ctx.stub.invokeChaincode(pdpChaincodeName, [functionName, ...args], ctx.channelId);
            if (response.status !== 200) {
                throw new Error(`Failed to invoke PDP chaincode. Status: ${response.status}`);
            }
            
            const decision = response.payload.toString();
            console.log(`Decision: ${decision}`);
    
            if (decision === 'Permit') {
                return 'Access granted';
            } else {
                return 'Access denied';
            }
        } catch (err) {
            console.error(`Error invoking PDP chaincode: ${err.message}`);
            return 'Access denied';
        }
    }
    
}

module.exports = PEPChaincode;
