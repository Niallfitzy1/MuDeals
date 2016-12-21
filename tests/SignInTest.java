package com.example.tests;

import com.thoughtworks.selenium.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import java.util.regex.Pattern;

public class rateWhileSignedOut_test {
	private Selenium selenium;

	@Before
	public void setUp() throws Exception {
		selenium = new DefaultSelenium("localhost", 4444, "*chrome", "localhost:5000");
		selenium.start();
	}

	@Test
	public void testRateWhileSignedOut_test() throws Exception {
		selenium.click("id=sign-out-button");
		selenium.click("//section[@id='recent-posts-list']/div/div[9]/div/span/div");
	}

	@After
	public void tearDown() throws Exception {
		selenium.stop();
	}
}
