# Hyperledger Fabric and WSO2 Identity Server Setup Guide

## Overview

This guide provides step-by-step instructions for setting up WSO2 Identity Server (IS) version 7.0.0 and Hyperledger Fabric for integrating XACML and SAML-based authentication. Follow these steps to configure your environment and run the applications.

## 1. Installing WSO2 Identity Server

1. **Download WSO2 IS 7.0.0**

   - Download from [WSO2 Identity Server](https://wso2.com/identity-server/)

2. **Install OpenJDK 17**

   - Open a terminal in the `wso2is-7.0.0/bin` folder and run:
     ```bash
     sudo apt install openjdk-17-jdk
     sudo update-alternatives --config java
     echo "export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64" >> ~/.bashrc
     echo "export PATH=$JAVA_HOME/bin:$PATH" >> ~/.bashrc
     source ~/.bashrc
     ```

3. **Configure WSO2 IS**

   - Go to the `wso2is-7.0.0/repository/conf` folder and open `carbon.xml` in a text editor.
   - `Ctrl+f` to search for `offset` and edit `<offset>0</offset>` to `<offset>4</offset>`.
   - Go back to the `bin` folder and run:
     ```bash
     ./wso2server.sh -DportOffset=4
     ```
   - Wait for the server to start. Then, open your browser and navigate to `https://localhost:9447/console`. Log in using `admin:admin`.

4. **Create a SAML-based Application**
   - Navigate to the `Home` section in the WSO2 console.
   - Click on `Standard-Based Application`, choose `SAML` and configure as follows:
     - **Name**: DEventManagementDApp
     - **Protocol**: SAML
     - **Issuer**: DEventManagementDApp
     - **ACS URL**: `https://localhost:3000/saml/consume` and `http://localhost:3000/saml/consume`
   - Click `Create` to create the app go to the `Protocol` tab and configure the rest as follows:
     - **Default Assertion Consumer Service URL**: `https://localhost:3000/saml/consume`
     - **Enable IdP Initiated SSO**: Check
     - **Enable Attribute Profile**: Check
     - **Logout Method**: Back Channel
     - **Single Logout Response URL**: `https://localhost:9447/samlsso`
     - **Single Logout Request URL**: `https://localhost:9447/samlsso`
     - **IdP Initiated Single Logout**: Enable
     - **Return To URLs**: Add `https://localhost:3000/app` and `https://localhost:3001`
     - **Enable Assertion Query Profile**: Check
   - Click `Update` to save changes.

## 2. Setting Up Hyperledger Fabric

1. **Install Docker and Docker Compose**

   - Remove old Docker versions:
     ```bash
     sudo apt-get remove docker docker-engine docker.io containerd runc
     ```
   - Update package list and install dependencies:
     ```bash
     sudo apt-get update
     sudo apt-get install apt-transport-https ca-certificates gnupg-agent software-properties-common lsb-release -y
     ```
   - Add Docker repository and install Docker:
     ```bash
     curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-keyring.gpg
     echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
     sudo apt-get update
     sudo apt-get install docker-ce docker-ce-cli containerd.io -y
     ```
   - Add user to Docker group:
     ```bash
     sudo groupadd docker
     sudo usermod -a -G docker $USER
     newgrp docker
     ```
   - Install Docker Compose:
     ```bash
     sudo curl -L https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
     sudo chmod +x /usr/local/bin/docker-compose
     docker container prune
     ```

2. **Initialize Hyperledger Fabric**

   - Create a directory for Hyperledger Fabric and run the bootstrap script:
     ```bash
     cd ../
     mkdir fabric
     cd fabric
     sudo curl -sSL https://raw.githubusercontent.com/hyperledger/fabric/master/scripts/bootstrap.sh | bash -s
     ```

3. **Clone Repository**

   - Clone the repository into `fabric/fabric-samples`:
     ```bash
     git clone bit.ly/xacmldapp
     ```
   - Navigate to the `server` and `client` folders and install dependencies:
     ```bash
     cd fabric-samples/HyperLedger-Fabric-Blockchain-driven-XACML-SAML-WSO2IS-Event-Management-DApp
     cd server
     npm install
     cd ../client
     npm install
     ```

4. **Configure Environment Variables**

   - Create `.env` file in the `server` folder with the following content:

     ```env
     SESSION_SECRET="a well secured secret"
     SAML_ENTRYPOINT="https://localhost:9447/samlsso"
     SAML_ISSUER="DEventManagementDApp"
     SAML_PROTOCOL="https://"
     SAML_LOGOUTURL="https://localhost:9447/samlsso"
     WSO2_ROLE_CLAIM="http://wso2.org/claims/roles"
     WSO2_EMAIL_CLAIM="http://wso2.org/claims/emailaddress"
     WSO2_FIRSTNAME_CLAIM="http://wso2.org/claims/givenname"
     WSO2_FULLNAME_CLAIM="http://wso2.org/claims/fullname"
     WSO2_LASTNAME_CLAIM="http://wso2.org/claims/lastname"
     WSO2_PHONENUMBERS_CLAIM="http://wso2.org/claims/phoneNumbers"
     WSO2_USERNAME_CLAIM="http://wso2.org/claims/username"
     IDP_CERTIFICATE_PATH='../security/IdPCertificate.pem'
     PORT=3000
     WSO2_ADMIN="admin"
     WSO2_ADMIN_PASS="admin"
     ```

   - Create `.env` file in the `client` folder with the following content:
     ```env
     HTTPS=true
     SSL_CRR_FILE="../server/security/server.cert"
     SSL_KEY_FILE="../server/security/server.key"
     ```

5. **Generate SSL Certificates**

   - Navigate to the `server/security` folder and run:

     ```bash
     openssl req -newkey rsa:2048 -nodes -keyout server.key -x509 -days 365 -out server.cert
     ```

   - Download the IdP certificate from WSO2 console, rename it to `IdPCertificate.cer`, and place it in the `security` folder. Run:
     ```bash
     node convert-cert.js
     ```
     This will generate `IdPCertificate.pem`.

6. **Deploy Hyperledger Fabric Chaincodes**

   - Navigate to the `test-network` directory and run the following commands:

     ```bash
     ./network.sh down    # Stop any previous network
     ./network.sh up createChannel  # Start network and create channel

     ./network.sh deployCC -ccn chaincodePAP -ccp ../HyperLedger-Fabric-Blockchain-driven-XACML-SAML-WSO2IS-Event-Management-DApp/server/chaincodes/chaincode-pap -ccl javascript
     ./network.sh deployCC -ccn chaincodePDP -ccp ../HyperLedger-Fabric-Blockchain-driven-XACML-SAML-WSO2IS-Event-Management-DApp/server/chaincodes/chaincode-pdp -ccl javascript
     ./network.sh deployCC -ccn chaincodePEP -ccp ../HyperLedger-Fabric-Blockchain-driven-XACML-SAML-WSO2IS-Event-Management-DApp/server/chaincodes/chaincode-pep -ccl javascript
     ./network.sh deployCC -ccn chaincodePIP -ccp ../HyperLedger-Fabric-Blockchain-driven-XACML-SAML-WSO2IS-Event-Management-DApp/server/chaincodes/chaincode-pip -ccl javascript
     ```

   - Set environment variables and initialize chaincodes:

     ```bash
     export PATH=${PWD}/../bin:$PATH
     export FABRIC_CFG_PATH=$PWD/../config/
     export CORE_PEER_TLS_ENABLED=true
     export CORE_PEER_LOCALMSPID=Org1MSP
     export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
     export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
     export CORE_PEER_ADDRESS=localhost:7051

     # Initialize chaincodePAP ledger
     peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n chaincodePAP --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"initLedger","Args":[]}'

     # Initialize chaincodePIP ledger
     peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n chaincodePIP --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"initLedger","Args":[]}'
     ```

## 3. Running the Application

1. **Start the Server**

   - Navigate to the `server` folder and run:
     ```bash
     node server.js
     ```

2. **Start the Client**
   - Navigate to the `client` folder and run:
     ```bash
     npm start
     ```

## Conclusion

Congratulations! You should now have WSO2 Identity Server and Hyperledger Fabric configured and running. You can access your application and start using it with SAML-based authentication and Hyperledger Fabric integration. Sign yourself up using the Sign-up button and set roles from WSO2IS Identity Server.

Ensure that all steps have been followed thoroughly and if you still encounter any issues feel free to reach us. Thank you and Enjoy!
