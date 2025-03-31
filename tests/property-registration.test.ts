import { describe, it, expect, beforeEach } from "vitest"
import { mockClarityContext } from "./test-utils"

// Mock Clarity context
const ctx = mockClarityContext()

describe("Property Registration Contract", () => {
  beforeEach(() => {
    // Reset the contract state before each test
    ctx.reset()
  })
  
  it("should register a new property", () => {
    // Set tx-sender
    ctx.setSender("ST1TEST1111111111111111111111111111111111111")
    
    // Call the register-property function
    const result = ctx.callPublic("register-property", ["PROP001", "N:40.123,E:74.456,S:40.120,W:74.460"])
    
    // Check the result
    expect(result.success).toBe(true)
    
    // Verify the property was registered
    const property = ctx.callReadOnly("get-property", ["PROP001"])
    expect(property).not.toBeNull()
    expect(property.owner).toBe("ST1TEST1111111111111111111111111111111111111")
  })
  
  it("should not register a property that already exists", () => {
    // Set tx-sender
    ctx.setSender("ST1TEST1111111111111111111111111111111111111")
    
    // Register a property
    ctx.callPublic("register-property", ["PROP002", "N:41.123,E:75.456,S:41.120,W:75.460"])
    
    // Try to register the same property again
    const result = ctx.callPublic("register-property", ["PROP002", "Different boundaries"])
    
    // Check that it failed
    expect(result.success).toBe(false)
    expect(result.error).toBe(1) // Error code 1
  })
  
  it("should update property boundaries if owner", () => {
    // Set tx-sender
    ctx.setSender("ST1TEST1111111111111111111111111111111111111")
    
    // Register a property
    ctx.callPublic("register-property", ["PROP003", "Original boundaries"])
    
    // Update the boundaries
    const result = ctx.callPublic("update-boundaries", ["PROP003", "Updated boundaries"])
    
    // Check the result
    expect(result.success).toBe(true)
    
    // Verify the boundaries were updated
    const property = ctx.callReadOnly("get-property", ["PROP003"])
    expect(property.boundaries).toBe("Updated boundaries")
  })
  
  it("should not update property boundaries if not owner", () => {
    // First user registers a property
    ctx.setSender("ST1TEST1111111111111111111111111111111111111")
    ctx.callPublic("register-property", ["PROP004", "Original boundaries"])
    
    // Second user tries to update the boundaries
    ctx.setSender("ST2TEST2222222222222222222222222222222222222")
    const result = ctx.callPublic("update-boundaries", ["PROP004", "Malicious update"])
    
    // Check that it failed
    expect(result.success).toBe(false)
    expect(result.error).toBe(2) // Error code 2
    
    // Verify the boundaries were not updated
    const property = ctx.callReadOnly("get-property", ["PROP004"])
    expect(property.boundaries).toBe("Original boundaries")
  })
})

