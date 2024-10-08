'use strict';

const { Contract } = require('fabric-contract-api');

class PEPChaincode extends Contract {

    async enforce(ctx, subject, action, resource) {
        const request = { subject, action, resource };
        console.log(`Enforcing request: ${JSON.stringify(request)}`);
        
        const pdpChaincodeName = 'chaincodePDP';
        const functionName = 'evaluate';
    
        // Send only the essential request data to the PDP chaincode
        const args = [JSON.stringify(request)];
    
        try {
            const response = await ctx.stub.invokeChaincode(pdpChaincodeName, [functionName, ...args], ctx.channelId);
            if (response.status !== 200) {
                throw new Error(`Failed to invoke PDP chaincode. Status: ${response.status}`);
            }
            
            const decision = response.payload.toString();
            console.log(`Decision: ${decision}`);
    
            return decision === 'Permit' ? 'Access granted' : 'Access denied';
        } catch (err) {
            console.error(`Error invoking PDP chaincode: ${err.message}`);
            return 'Access denied';
        }
    }
    
    
}

module.exports = PEPChaincode;
