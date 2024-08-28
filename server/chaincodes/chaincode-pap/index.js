/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const papChaincode = require('./lib/papChaincode');

module.exports.PAPChaincode = papChaincode;
module.exports.contracts = [papChaincode];
