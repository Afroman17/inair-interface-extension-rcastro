# Block Environment Management

This directory contains scripts for managing different Airtable block configurations for DEV and PROD environments.

## Files

- **`block-config.json`** - Configuration file storing blockId and baseId for each environment
- **`update-block-config.js`** - Script that updates `.block/remote.json` based on the target environment

## Setup

1. Update `block-config.json` with your actual block IDs:

```json
{
  "dev": {
    "blockId": "YOUR_DEV_BLOCK_ID",
    "baseId": "NONE"
  },
  "prod": {
    "blockId": "YOUR_PROD_BLOCK_ID",
    "baseId": "NONE"
  }
}
```

2. If you want to keep your block IDs private, add this file to `.gitignore`:
```bash
echo "scripts/block-config.json" >> .gitignore
```

## Usage

### Development
Run the block in development mode with DEV blockId:
```bash
npm run dev
```

This will:
1. Update `.block/remote.json` with the DEV blockId
2. Run `npx block run`

### Release to DEV
Release the block to the DEV environment:
```bash
npm run release:dev
```

This will:
1. Update `.block/remote.json` with the DEV blockId
2. Run `npx block release`

### Release to PROD
Release the block to the PROD environment:
```bash
npm run release:prod
```

This will:
1. Update `.block/remote.json` with the PROD blockId
2. Run `npx block release`

## How It Works

The `update-block-config.js` script:
1. Reads the environment from the command line argument (`dev` or `prod`)
2. Loads the corresponding configuration from `block-config.json`
3. Updates `.block/remote.json` with the appropriate blockId and baseId
4. Provides clear feedback about which environment is being used

This ensures you never accidentally release to the wrong block!
