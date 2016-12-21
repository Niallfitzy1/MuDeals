package com.example.tests;

import com.thoughtworks.selenium.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import java.util.regex.Pattern;

public class addComment_test {
	private Selenium selenium;

	@Before
	public void setUp() throws Exception {
		selenium = new DefaultSelenium("localhost", 4444, "*chrome", "localhost:5000");
		selenium.start();
	}

	@Test
	public void testAddComment_test() throws Exception {
		selenium.click("id=sign-in-button");
		selenium.click("//section[@id='recent-posts-list']/div/div[9]/div/form/div");
		selenium.type("xpath=(//input[@type='text'])[10]", "Great Deal");
		selenium.keyPress("xpath=(//input[@type='text'])[10]", "\\13");
	}

	@After
	public void tearDown() throws Exception {
		selenium.stop();
	}
}
