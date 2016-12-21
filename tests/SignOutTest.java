package com.example.tests;

import com.thoughtworks.selenium.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import java.util.regex.Pattern;

public class signOut_test {
	private Selenium selenium;

	@Before
	public void setUp() throws Exception {
		selenium = new DefaultSelenium("localhost", 4444, "*chrome", "localhost:5000");
		selenium.start();
	}

	@Test
	public void testSignOut_test() throws Exception {
		selenium.click("id=sign-out-button");
	}

	@After
	public void tearDown() throws Exception {
		selenium.stop();
	}
}
