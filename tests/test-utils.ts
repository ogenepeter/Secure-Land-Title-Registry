// Mock utilities for testing Clarity contracts

/**
 * Creates a mock Clarity context for testing
 */
export function mockClarityContext() {
	// Store contract state
	const state = {
		maps: {},
		vars: {},
		blockHeight: 0,
		sender: null,
		contractCalls: {},
		readOnlyCalls: {},
	}
	
	return {
		// Reset the state
		reset() {
			state.maps = {}
			state.vars = {}
			state.blockHeight = 0
			state.sender = null
			state.contractCalls = {}
			state.readOnlyCalls = {}
		},
		
		// Set the current block height
		setBlockHeight(height) {
			state.blockHeight = height
		},
		
		// Set the transaction sender
		setSender(address) {
			state.sender = address
		},
		
		// Mock a contract call
		mockContractCall(contract, function_name, args, result) {
			const key = `${contract}.${function_name}.${JSON.stringify(args)}`
			state.contractCalls[key] = result
		},
		
		// Mock a read-only call
		mockReadOnlyCall(function_name, args, result) {
			const key = `${function_name}.${JSON.stringify(args)}`
			state.readOnlyCalls[key] = result
		},
		
		// Call a public function
		callPublic(function_name, args) {
			// Check if we're mocking a contract call
			for (const key in state.contractCalls) {
				if (key.includes(function_name) && key.includes(JSON.stringify(args))) {
					return { success: true, value: state.contractCalls[key] }
				}
			}
			
			// Simulate the function call
			try {
				// This is a simplified simulation - in a real implementation,
				// you would interpret the Clarity code and execute it
				return { success: true, value: true }
			} catch (error) {
				return { success: false, error: error.code || 1 }
			}
		},
		
		// Call a read-only function
		callReadOnly(function_name, args) {
			// Check if we're mocking a read-only call
			const key = `${function_name}.${JSON.stringify(args)}`
			if (state.readOnlyCalls[key]) {
				return state.readOnlyCalls[key]
			}
			
			// Simulate the function call
			try {
				// This is a simplified simulation - in a real implementation,
				// you would interpret the Clarity code and execute it
				return { success: true }
			} catch (error) {
				return null
			}
		},
	}
}

/**
 * Creates a mock for Clarity Bitcoin operations
 */
export function mockClarityBitcoin() {
	return {
		// Mock Bitcoin-related functions
		getBlockHeight() {
			return 700000
		},
		
		getTxId(block, index) {
			return "0x1234567890abcdef"
		},
		
		// Add more Bitcoin-related mock functions as needed
	}
}

