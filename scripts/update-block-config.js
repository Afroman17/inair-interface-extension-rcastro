#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Updates the .block/remote.json file with the appropriate blockId
 * based on the environment (dev or prod)
 */

const REMOTE_CONFIG_PATH = path.join(__dirname, '../.block/remote.json');
const BLOCK_CONFIG_PATH = path.join(__dirname, 'block-config.json');

// Get environment from command line argument
const environment = process.argv[2];

if (!environment || !['dev', 'prod'].includes(environment)) {
  console.error('❌ Error: Environment must be either "dev" or "prod"');
  console.error('Usage: node update-block-config.js <dev|prod>');
  process.exit(1);
}

try {
  // Read the block configuration
  const blockConfig = JSON.parse(fs.readFileSync(BLOCK_CONFIG_PATH, 'utf8'));
  
  if (!blockConfig[environment]) {
    console.error(`❌ Error: No configuration found for environment "${environment}"`);
    process.exit(1);
  }

  const config = blockConfig[environment];
  
  // Validate that blockId exists
  if (!config.blockId) {
    console.error(`❌ Error: blockId not configured for "${environment}" environment`);
    console.error(`Please update ${BLOCK_CONFIG_PATH} with the correct blockId`);
    process.exit(1);
  }

  // Create the remote.json content
  const remoteConfig = {
    blockId: config.blockId,
    baseId: config.baseId || 'NONE'
  };

  // Ensure .block directory exists
  const blockDir = path.dirname(REMOTE_CONFIG_PATH);
  if (!fs.existsSync(blockDir)) {
    fs.mkdirSync(blockDir, { recursive: true });
  }

  // Write the updated configuration
  fs.writeFileSync(
    REMOTE_CONFIG_PATH,
    JSON.stringify(remoteConfig, null, 2) + '\n',
    'utf8'
  );

  console.log(`✅ Updated .block/remote.json for ${environment.toUpperCase()} environment`);
  console.log(`   Block ID: ${config.blockId}`);
  console.log(`   Base ID: ${config.baseId || 'NONE'}`);
  
} catch (error) {
  console.error('❌ Error updating block configuration:', error.message);
  process.exit(1);
}
