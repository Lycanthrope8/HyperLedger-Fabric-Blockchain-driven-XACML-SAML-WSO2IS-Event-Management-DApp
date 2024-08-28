/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const pdpChaincode = require('./lib/pdpChaincode');

module.exports.PDPChaincode = pdpChaincode;
module.exports.contracts = [pdpChaincode];
