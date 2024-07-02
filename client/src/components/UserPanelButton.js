import React from 'react';
import './Button.css';

function UserPanelButton() {
  const handleUserClick = async () => {
    try {
      // const xacmlRequest = `
      //   <Request xmlns="urn:oasis:names:tc:xacml:3.0:core:schema:wd-17" CombinedDecision="false" ReturnPolicyIdList="false">
      //     <Attributes Category="urn:oasis:names:tc:xacml:3.0:attribute-category:resource">
      //       <Attribute AttributeId="urn:oasis:names:tc:xacml:1.0:resource:resource-id" IncludeInResult="false">
      //         <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">user/panel</AttributeValue>
      //       </Attribute>
      //     </Attributes>
      //     <Attributes Category="urn:oasis:names:tc:xacml:1.0:subject-category:access-subject">
      //       <Attribute AttributeId="urn:oasis:names:tc:xacml:1.0:subject:subject-id" IncludeInResult="false">
      //         <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">farhan</AttributeValue>
      //       </Attribute>
      //     </Attributes>
      //     <Attributes Category="urn:oasis:names:tc:xacml:3.0:attribute-category:action">
      //       <Attribute AttributeId="urn:oasis:names:tc:xacml:1.0:action:action-id" IncludeInResult="false">
      //         <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">POST</AttributeValue>
      //       </Attribute>
      //     </Attributes>
      //   </Request>
      // `;

      // const pdpResponse = await fetch('https://localhost:9443/api/identity/entitlement/decision/pdp', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': 'Basic ZmFyaGFuOmFiYzEyM0FCQyE=',
      //     'Content-Type': 'application/xml',
      //     'Accept': 'application/xml',
      //   },
      //   body: xacmlRequest,
      //   credentials: 'include', 
      // });

      // if (!pdpResponse.ok) {
      //   throw new Error(`XACML PDP HTTP error! Status: ${pdpResponse.status}`);
      // }
      const response = await fetch('https://localhost:3000/app/user-info', {
        method: 'GET',
        credentials: 'include', 
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('User Info:', data);  
      // const data2 = await pdpResponse.text();
      // console.log('PDP Response:', data2);

      
      alert(`
        Display Name: ${data.displayName}
        Email: ${data.email}
        First Name: ${data.firstName}
        Full Name: ${data.fullName}
        Last Name: ${data.lastName}
        Phone Numbers: ${data.phoneNumbers.join(', ')}
        Roles: ${data.roles}
        Username: ${data.username}
      `);

    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  return (
    <button className="panel-button" onClick={handleUserClick}>User Panel</button>
  );
}

export default UserPanelButton;
