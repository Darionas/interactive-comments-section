public class JavaScriptInterface {
    Context mContext;

    /** Instantiate the interface and set the context */
    JavaScriptInterface(Context c) {
        mContext = c;
    }

    @JavascriptInterface
    public void test(String test) {
        // Do whatever you want with the deviceId
        sessionStorage.setItem('test', JSON.stringify('Hey'));
    }
}

webView.addJavascriptInterface(new JavaScriptInterface(this), "injectedObject");