package com.malikalludo.facebook

// Placement: once Cocos Creator generates its native Android project (build
// once in Creator to get native/engine/android/... created), this file goes
// under that project's app/src/main/java/ tree - exact path depends on the
// installed Creator version's native customization convention (confirm in
// Phase 0). Referenced from AppActivity per the integration notes at the
// bottom of this file.
//
// Replaces the native-login half of Assets/Scripts/Managers/FaceBookManager.cs
// (FB.LogInWithReadPermissions + AccessToken.CurrentAccessToken.TokenString).
// Everything downstream of getting the access token (Graph API profile
// fetch, POST to the backend /auth endpoint, storing server_auth_token,
// opening the socket) is plain TypeScript and does NOT need a native bridge -
// see assets/scripts/native/FacebookAuthService.ts.

import android.app.Activity
import android.content.Intent
import com.cocos.lib.JsbBridge
import com.facebook.AccessToken
import com.facebook.CallbackManager
import com.facebook.FacebookCallback
import com.facebook.FacebookException
import com.facebook.login.LoginManager
import com.facebook.login.LoginResult
import org.json.JSONObject
import java.util.Arrays

/**
 * Bridges the Facebook Android SDK's native login flow to TypeScript via
 * Cocos Creator's JsbBridge. Only the login handshake goes through this
 * bridge - see FacebookAuthService.ts for everything after the access token
 * is obtained.
 */
object FacebookLoginBridge {
    private const val EVENT_NAME = "FacebookLoginResult"
    private val callbackManager = CallbackManager.Factory.create()

    /** Call once from AppActivity.onCreate(). */
    fun register(activity: Activity) {
        JsbBridge.setCallback { command, _ ->
            when (command) {
                "login" -> login(activity)
                "logout" -> logout()
            }
        }

        LoginManager.getInstance().registerCallback(callbackManager, object : FacebookCallback<LoginResult> {
            override fun onSuccess(result: LoginResult) {
                val json = JSONObject()
                json.put("status", "success")
                json.put("accessToken", result.accessToken.token)
                JsbBridge.sendToScript(EVENT_NAME, json.toString())
            }

            override fun onCancel() {
                val json = JSONObject()
                json.put("status", "cancelled")
                JsbBridge.sendToScript(EVENT_NAME, json.toString())
            }

            override fun onError(error: FacebookException) {
                val json = JSONObject()
                json.put("status", "error")
                json.put("message", error.message ?: "unknown Facebook login error")
                JsbBridge.sendToScript(EVENT_NAME, json.toString())
            }
        })
    }

    /** Call from AppActivity.onActivityResult() - the FB SDK needs this to complete the login flow. */
    fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        callbackManager.onActivityResult(requestCode, resultCode, data)
    }

    private fun login(activity: Activity) {
        if (AccessToken.getCurrentAccessToken() != null && !AccessToken.getCurrentAccessToken()!!.isExpired) {
            // already logged in - Unity's FaceBookManager.Login() had the same
            // "if already logged in, no-op" guard (FB.IsLoggedIn check).
            val json = JSONObject()
            json.put("status", "success")
            json.put("accessToken", AccessToken.getCurrentAccessToken()!!.token)
            JsbBridge.sendToScript(EVENT_NAME, json.toString())
            return
        }
        LoginManager.getInstance().logInWithReadPermissions(activity, Arrays.asList("public_profile", "email"))
    }

    private fun logout() {
        LoginManager.getInstance().logOut()
    }
}

/*
 * AppActivity integration (Cocos Creator's generated native Android entry
 * point, typically AppActivity.java or .kt extending CocosActivity - exact
 * base class name confirmed once Creator is installed):
 *
 *   override fun onCreate(savedInstanceState: Bundle?) {
 *       super.onCreate(savedInstanceState)
 *       FacebookLoginBridge.register(this)
 *   }
 *
 *   override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
 *       super.onActivityResult(requestCode, resultCode, data)
 *       FacebookLoginBridge.onActivityResult(requestCode, resultCode, data)
 *   }
 */
