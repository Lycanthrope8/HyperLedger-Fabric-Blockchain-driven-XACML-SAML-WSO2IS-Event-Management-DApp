/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const pipChaincode = require('./lib/pipChaincode');

module.exports.PIPChaincode = pipChaincode;
module.exports.contracts = [pipChaincode];


