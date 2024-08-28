/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const pepChaincode = require('./lib/pepChaincode');

module.exports.pepChaincode = pepChaincode;
module.exports.contracts = [pepChaincode];
