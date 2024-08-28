'use strict';

const { Contract } = require('fabric-contract-api');

class PAPChaincode extends Contract {

    async initLedger(ctx) {
        console.log('Initializing the PAP ledger');
        const initialPolicies = [
            {
                "id": "policy_managementAccessSalaryPolicy",
                "xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Policy xmlns=\"urn:oasis:names:tc:xacml:3.0:core:schema:wd-17\"\n        PolicyId=\"ManagementAccessSalaryPolicy\"\n        RuleCombiningAlgId=\"urn:oasis:names:tc:xacml:1.0:rule-combining-algorithm:first-applicable\"\n        Version=\"1.0\">\n    <Description>\n        Policy to grant read and write access to the salary panel for users with the management role.\n    </Description>\n    <Target>\n        <!-- Define the applicable resource and action -->\n        <Resources>\n            <Resource>\n                <ResourceMatch MatchId=\"urn:oasis:names:tc:xacml:1.0:function:string-equal\">\n                    <AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">salaryPanel</AttributeValue>\n                    <ResourceAttributeDesignator AttributeId=\"urn:oasis:names:tc:xacml:1.0:resource:resource-id\"\n                                                 DataType=\"http://www.w3.org/2001/XMLSchema#string\"/>\n                </ResourceMatch>\n            </Resource>\n        </Resources>\n        <Actions>\n            <Action>\n                <ActionMatch MatchId=\"urn:oasis:names:tc:xacml:1.0:function:string-equal\">\n                    <AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">read</AttributeValue>\n                    <ActionAttributeDesignator AttributeId=\"urn:oasis:names:tc:xacml:1.0:action:action-id\"\n                                               DataType=\"http://www.w3.org/2001/XMLSchema#string\"/>\n                </ActionMatch>\n                <ActionMatch MatchId=\"urn:oasis:names:tc:xacml:1.0:function:string-equal\">\n                    <AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">write</AttributeValue>\n                    <ActionAttributeDesignator AttributeId=\"urn:oasis:names:tc:xacml:1.0:action:action-id\"\n                                               DataType=\"http://www.w3.org/2001/XMLSchema#string\"/>\n                </ActionMatch>\n            </Action>\n        </Actions>\n    </Target>\n    <Rule RuleId=\"GrantReadAndWriteToManagement\"\n          Effect=\"Permit\">\n        <Description>\n            Grant read and write access if the user has the management role.\n        </Description>\n        <Target>\n            <Subjects>\n                <Subject>\n                    <SubjectMatch MatchId=\"urn:oasis:names:tc:xacml:1.0:function:string-equal\">\n                        <AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">management</AttributeValue>\n                        <SubjectAttributeDesignator AttributeId=\"urn:oasis:names:tc:xacml:1.0:subject:subject-role-id\"\n                                                    DataType=\"http://www.w3.org/2001/XMLSchema#string\"/>\n                    </SubjectMatch>\n                </Subject>\n            </Subjects>\n        </Target>\n    </Rule>\n    <!-- Default Deny Rule -->\n    <Rule RuleId=\"DefaultDeny\"\n          Effect=\"Deny\"/>\n</Policy>"
            },            
            {
                "id": "policy_adminPolicy",
                "xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Policy xmlns=\"urn:oasis:names:tc:xacml:3.0:core:schema:wd-17\"\n        PolicyId=\"AdminWriteAccessPolicy\"\n        RuleCombiningAlgId=\"urn:oasis:names:tc:xacml:1.0:rule-combining-algorithm:first-applicable\"\n        Version=\"1.0\">\n    <Description>\n        Policy to grant write access to the admin panel for users with the admin role.\n    </Description>\n    <Target>\n        <!-- Define the applicable resource and action -->\n        <Resources>\n            <Resource>\n                <ResourceMatch MatchId=\"urn:oasis:names:tc:xacml:1.0:function:string-equal\">\n                    <AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">adminPanel</AttributeValue>\n                    <ResourceAttributeDesignator AttributeId=\"urn:oasis:names:tc:xacml:1.0:resource:resource-id\"\n                                                 DataType=\"http://www.w3.org/2001/XMLSchema#string\"/>\n                </ResourceMatch>\n            </Resource>\n        </Resources>\n        <Actions>\n            <Action>\n                <ActionMatch MatchId=\"urn:oasis:names:tc:xacml:1.0:function:string-equal\">\n                    <AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">write</AttributeValue>\n                    <ActionAttributeDesignator AttributeId=\"urn:oasis:names:tc:xacml:1.0:action:action-id\"\n                                               DataType=\"http://www.w3.org/2001/XMLSchema#string\"/>\n                </ActionMatch>\n            </Action>\n        </Actions>\n    </Target>\n    <Rule RuleId=\"GrantWriteToAdmin\"\n          Effect=\"Permit\">\n        <Description>\n            Grant write access if the user has the admin role.\n        </Description>\n        <Target>\n            <Subjects>\n                <Subject>\n                    <SubjectMatch MatchId=\"urn:oasis:names:tc:xacml:1.0:function:string-equal\">\n                        <AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">admin</AttributeValue>\n                        <SubjectAttributeDesignator AttributeId=\"urn:oasis:names:tc:xacml:1.0:subject:subject-role-id\"\n                                                    DataType=\"http://www.w3.org/2001/XMLSchema#string\"/>\n                    </SubjectMatch>\n                </Subject>\n            </Subjects>\n        </Target>\n    </Rule>\n    <!-- Default Deny Rule -->\n    <Rule RuleId=\"DefaultDeny\"\n          Effect=\"Deny\"/>\n</Policy>"
            },
            {
                "id": "policy_userPolicy",
                "xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Policy xmlns=\"urn:oasis:names:tc:xacml:3.0:core:schema:wd-17\"\n        PolicyId=\"AdminWriteAccessPolicy\"\n        RuleCombiningAlgId=\"urn:oasis:names:tc:xacml:1.0:rule-combining-algorithm:first-applicable\"\n        Version=\"1.0\">\n    <Description>\n        Policy to grant write access to the admin panel for users with the admin role.\n    </Description>\n    <Target>\n        <!-- Define the applicable resource and action -->\n        <Resources>\n            <Resource>\n                <ResourceMatch MatchId=\"urn:oasis:names:tc:xacml:1.0:function:string-equal\">\n                    <AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">userPanel</AttributeValue>\n                    <ResourceAttributeDesignator AttributeId=\"urn:oasis:names:tc:xacml:1.0:resource:resource-id\"\n                                                 DataType=\"http://www.w3.org/2001/XMLSchema#string\"/>\n                </ResourceMatch>\n            </Resource>\n        </Resources>\n        <Actions>\n            <Action>\n                <ActionMatch MatchId=\"urn:oasis:names:tc:xacml:1.0:function:string-equal\">\n                    <AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">read</AttributeValue>\n                    <ActionAttributeDesignator AttributeId=\"urn:oasis:names:tc:xacml:1.0:action:action-id\"\n                                               DataType=\"http://www.w3.org/2001/XMLSchema#string\"/>\n                </ActionMatch>\n            </Action>\n        </Actions>\n    </Target>\n    <Rule RuleId=\"GrantWriteToAdmin\"\n          Effect=\"Permit\">\n        <Description>\n            Grant write access if the user has the admin role.\n        </Description>\n        <Target>\n            <Subjects>\n                <Subject>\n                    <SubjectMatch MatchId=\"urn:oasis:names:tc:xacml:1.0:function:string-equal\">\n                        <AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">user</AttributeValue>\n                        <SubjectAttributeDesignator AttributeId=\"urn:oasis:names:tc:xacml:1.0:subject:subject-role-id\"\n                                                    DataType=\"http://www.w3.org/2001/XMLSchema#string\"/>\n                    </SubjectMatch>\n                </Subject>\n            </Subjects>\n        </Target>\n    </Rule>\n    <!-- Default Deny Rule -->\n    <Rule RuleId=\"DefaultDeny\"\n          Effect=\"Deny\"/>\n</Policy>"
            },
            
            
        ];

        for (const policy of initialPolicies) {
            const policyKey = `policy_${policy.id}`;
            await ctx.stub.putState(policyKey, Buffer.from(policy.xml));
            console.log(`Policy ${policy.id} added`);
        }
    }

    async addPolicy(ctx, policyId, policyXml) {
        
        console.log(`Adding policy ${policyId}`);
        const policyKey = `policy_${policyId}`;
        await ctx.stub.putState(policyKey, Buffer.from(policyXml));
        console.log(`Policy ${policyId} added`);
    }

    async getPolicy(ctx, policyId) {
        console.log(`Getting policy ${policyId}`);
        const policyKey = `policy_${policyId}`;
        const policy = await ctx.stub.getState(policyKey);

        if (!policy || policy.length === 0) {
            throw new Error(`Policy ${policyId} does not exist`);
        }
        return policy.toString();
    }

    async getAllPolicies(ctx) {
        console.log('Getting all policies');
        const startKey = 'policy_';
        const endKey = 'policy_~';  // '~' ensures you get all keys starting with 'policy_'
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const result = [];
    
        while (true) {
            const res = await iterator.next();
            if (res.done) {
                console.log('End of data');
                await iterator.close();
                break;
            }
            if (res.value && res.value.value) {
                // Parse each record into a readable format
                const Key = res.value.key;
                const Record = res.value.value.toString('utf8');
                console.log("RECORD: ",Record);
                result.push({ Key, Record });
            }
        }
        
        return result;
    }
    
    
    
    
}

module.exports = PAPChaincode;
