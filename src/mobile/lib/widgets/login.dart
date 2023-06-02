import 'package:android_app/widgets/sign_up.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class LoginWidget extends StatefulWidget {
  const LoginWidget({Key? key}) : super(key: key);

  @override
  State<LoginWidget> createState() => _LoginWidgetState();
}

class _LoginWidgetState extends State<LoginWidget> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  Future logIn() async {
    await FirebaseAuth.instance
        .signInWithEmailAndPassword(
            email: emailController.text.trim(),
            password: passwordController.text.trim())
        .then((value) {})
        .catchError((onError) {
      if (onError.toString().contains('user-not-found')) {
        showAlertDialog(context,
            "You have not created an account with this gmail or may have been deleted");
      }
    });
  }

  void openSignUp() {
    Navigator.push(
        context, MaterialPageRoute(builder: (context) => const SignUpWidget()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.only(top: 100, left: 40, right: 40),
          child: Column(
            children: [
              SvgPicture.asset(
                'assets/adtour_logo.svg',
                height: 200,
              ),
              TextField(
                controller: emailController,
                textInputAction: TextInputAction.next,
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(
                    hintText: 'Email', labelText: 'Email'),
              ),
              TextField(
                controller: passwordController,
                textInputAction: TextInputAction.next,
                obscureText: true,
                decoration: const InputDecoration(
                    hintText: 'Password', labelText: 'Password'),
              ),
              Row(
                children: [
                  Expanded(
                      child: ElevatedButton(
                          onPressed: logIn, child: const Text("Login")))
                ],
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text("Dont have an account?"),
                  TextButton(
                    onPressed: openSignUp,
                    child: Text(
                      "Create Account",
                      style: TextStyle(color: Colors.amber.shade600),
                    ),
                  )
                ],
              ),
              Row(
                children: [
                  Checkbox(
                    value: true,
                    onChanged: (value) {},
                  ),
                  const SizedBox(
                    width: 210,
                    child: Text(
                      "By clicking Continue, you agree to our Terms & Conditions and that you have read our Data Policy",
                      style: TextStyle(fontSize: 13),
                    ),
                  )
                ],
              )
            ],
          ),
        ),
      ),
    );
  }

  showAlertDialog(BuildContext context, String message) {
    // set up the button
    Widget okButton = TextButton(
      child: const Text("OK"),
      onPressed: () {
        Navigator.pop(context);
      },
    );

    // set up the AlertDialog
    AlertDialog alert = AlertDialog(
      title: const Text("Login Error"),
      content: Text(message),
      actions: [
        okButton,
      ],
    );

    // show the dialog
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return alert;
      },
    );
  }
}
