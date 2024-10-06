'use strict';

const { Contract } = require('fabric-contract-api');
const { parseStringPromise } = require('xml2js').Parser({ explicitArray: true });

class PDPChaincode extends Contract {

    async evaluate(ctx, requestStr) {
        // console.log("Context in evaluate: ", ctx);
        const request = JSON.parse(requestStr);
        let policies = await this.getAllPoliciesFromPapChaincode(ctx);
        policies = JSON.parse(policies);
        let decision = 'Deny';
    
        //console.log(`Policies: ${JSON.stringify(policies)}`);
    
        for (const policy of policies) {
            const policyXml = policy.Record;
            const parsedPolicy = await this.parseXml(policyXml);
    
            //console.log(`Evaluating policy: ${policy.Key}`);
            const result = await this.evaluatePolicy(ctx, parsedPolicy, request);
    
            if (result === 'Permit') {
                decision = 'Permit';
                break;
            }
        }
    
        return decision;
    }

    

    async evaluatePolicy(ctx, policy, request) {
        // console.log("Policy: ", JSON.stringify(policy, null, 2));
        const rules = policy.Policy.Rule;
        
        for (const rule of rules) {
            if (await this.matchRule(ctx, policy.Policy, rule, request)) {
                return rule.$.Effect;
            }
        }
    
        return 'Deny';
    }
    


    async matchRule(ctx, policy, rule, request) {
        const rolesData = await this.getRolesFromPipChaincode(ctx.stub, request.subject);
        if (!rolesData) {
            console.error('No roles data available');
            return false;
        }
        const roles = JSON.parse(rolesData).role;
        console.log(`Roles for ${request.subject}: ${roles}`);
    
        const subjectMatches = rule.Target?.[0]?.Subjects?.[0]?.Subject?.[0]?.SubjectMatch;
        const actionMatches = policy.Target?.[0]?.Actions?.[0]?.Action?.[0]?.ActionMatch;
        const resourceMatches = policy.Target?.[0]?.Resources?.[0]?.Resource?.[0]?.ResourceMatch;
    
        const subjectMatch = subjectMatches?.some(sm =>
            roles.includes(sm.AttributeValue[0]._)
        );
    
        const actionMatch = actionMatches?.some(am =>
            request.action === am.AttributeValue[0]._
        );
    
        // If the role is 'admin', skip resource matching to grant access to all resources
        const resourceMatch = roles.includes("admin") || resourceMatches?.some(rm =>
            request.resource === rm.AttributeValue[0]._
        );
    
        if (!subjectMatch || !actionMatch || !resourceMatch) {
            console.error('No valid match found for subject, action, or resource');
            return false;
        }
    
        return rule.$.Effect === 'Permit';
    }
    
    
    
    
    


    async parseXml(xml) {
        // xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Policy xmlns=\"urn:oasis:names:tc:xacml:3.0:core:schema:wd-17\"\n        PolicyId=\"AdminWriteAccessPolicy\"\n        RuleCombiningAlgId=\"urn:oasis:names:tc:xacml:1.0:rule-combining-algorithm:first-applicable\"\n        Version=\"1.0\">\n    <Description>\n        Policy to grant write access to the admin panel for users with the admin role.\n    </Description>\n    <Target>\n        <!-- Define the applicable resource and action -->\n        <Resources>\n            <Resource>\n                <ResourceMatch MatchId=\"urn:oasis:names:tc:xacml:1.0:function:string-equal\">\n                    <AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">adminPanel</AttributeValue>\n                    <ResourceAttributeDesignator AttributeId=\"urn:oasis:names:tc:xacml:1.0:resource:resource-id\"\n                                                 DataType=\"http://www.w3.org/2001/XMLSchema#string\"/>\n                </ResourceMatch>\n            </Resource>\n        </Resources>\n        <Actions>\n            <Action>\n                <ActionMatch MatchId=\"urn:oasis:names:tc:xacml:1.0:function:string-equal\">\n                    <AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">write</AttributeValue>\n                    <ActionAttributeDesignator AttributeId=\"urn:oasis:names:tc:xacml:1.0:action:action-id\"\n                                               DataType=\"http://www.w3.org/2001/XMLSchema#string\"/>\n                </ActionMatch>\n            </Action>\n        </Actions>\n    </Target>\n    <Rule RuleId=\"GrantWriteToAdmin\"\n          Effect=\"Permit\">\n        <Description>\n            Grant write access if the user has the admin role.\n        </Description>\n        <Target>\n            <Subjects>\n                <Subject>\n                    <SubjectMatch MatchId=\"urn:oasis:names:tc:xacml:1.0:function:string-equal\">\n                        <AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">admin</AttributeValue>\n                        <SubjectAttributeDesignator AttributeId=\"urn:oasis:names:tc:xacml:1.0:subject:subject-role-id\"\n                                                    DataType=\"http://www.w3.org/2001/XMLSchema#string\"/>\n                    </SubjectMatch>\n                </Subject>\n            </Subjects>\n        </Target>\n    </Rule>\n    <!-- Default Deny Rule -->\n    <Rule RuleId=\"DefaultDeny\"\n          Effect=\"Deny\"/>\n</Policy>"
        
        if (!xml) {
            console.error("XML data is undefined or null.");
            throw new Error("XML data is undefined or null.");
        }

        try {
            return await parseStringPromise(xml);
        } catch (err) {
            console.error(`Error parsing XML: ${err.message}`);
            throw new Error(`Error parsing XML: ${err.message}`);
        }
    }

    async getAllPoliciesFromPapChaincode(ctx) {
        // console.log("Context in getAllPoliciesFromPapChaincode: ", ctx);
        const papChaincodeName = 'chaincodePAP';
        const functionName = 'getAllPolicies';
        try {
            const response = await ctx.stub.invokeChaincode(papChaincodeName, [functionName], ctx.channelId);
            if (response.status !== 200) {
                throw new Error(`Failed to invoke PAP chaincode. Status: ${response.status}`);
            }

            const payloadString = response.payload;

            try {
                return payloadString;  // Return the parsed policies
            } catch (parseErr) {
                console.error("Error parsing JSON from payload:", parseErr);
                throw new Error("Failed to parse JSON from response payload.");
            }
    
        } catch (err) {
            console.error("Error in handling chaincode invocation:", err);
            throw new Error(`Error invoking PAP chaincode: ${err.message}`);
        }
    }
    
    
    
    
    
    
    

    async getRolesFromPipChaincode(stub, username) {
        // console.log("Stub in getRolesFromPipChaincode: ", stub);
        // console.log(`Getting roles for ${username}`);
        const pipChaincodeName = 'chaincodePIP';
        const functionName = 'getRole';
        try {
            const response = await stub.invokeChaincode(pipChaincodeName, [functionName, username], this.channelId);
            if (response.status !== 200) {
                throw new Error(`Failed to invoke PIP chaincode. Status: ${response.status}`);
            }
            
            const rolesData = response.payload.toString();
            if (!rolesData) {
                console.error(`No roles found for ${username}`);
                return '{}';  // Return an empty object in string format if no roles are found
            }
            // console.log(`Roles for ${username}: ${rolesData}`);
            return rolesData;
        } catch (err) {
            console.error(`Error getting roles from PIP chaincode for ${username}: ${err.message}`);
            throw new Error(`Error getting roles from PIP chaincode: ${err.message}`);
        }
    }    
    
}

module.exports = PDPChaincode;
