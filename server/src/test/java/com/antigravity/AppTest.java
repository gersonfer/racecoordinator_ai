package com.antigravity;

import org.junit.Test;
import static org.junit.Assert.*;

public class AppTest {

    @Test
    public void testGetLocalIpAddress() {
        String ip = App.getLocalIpAddress();
        assertNotNull(ip);
        assertFalse(ip.isEmpty());
        // Verify it is either "Unknown" or matches IP pattern
        assertTrue(ip.equals("Unknown") || ip.matches("\\d+\\.\\d+\\.\\d+\\.\\d+"));
    }
}
