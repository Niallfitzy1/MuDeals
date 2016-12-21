import junit.framework.Test;
import junit.framework.TestSuite;

public class SiteTests {

	public static Test suite() {
		TestSuite suite = new TestSuite();
		suite.addTestSuite(signIn_test.class);
		suite.addTestSuite(rate_test.class);
		suite.addTestSuite(addComment_test.class);
		suite.addTestSuite(signOut_test.class);
		suite.addTestSuite(rateWhileSignedOut_test.class);
		return suite;
	}

	public static void main(String[] args) {
		junit.textui.TestRunner.run(suite());
	}
}
