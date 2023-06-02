import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class SignUpWidget extends StatefulWidget {
  const SignUpWidget({Key? key}) : super(key: key);

  @override
  State<SignUpWidget> createState() => _SignUpWidgetState();
}

class _SignUpWidgetState extends State<SignUpWidget> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final firstnameController = TextEditingController();
  final lastnameController = TextEditingController();
  final ageController = TextEditingController();
  final phoneNumberController = TextEditingController();
  bool? isMale;

  Future signUp() async {
    if (emailController.text.isEmpty ||
        passwordController.text.isEmpty ||
        firstnameController.text.isEmpty ||
        lastnameController.text.isEmpty ||
        lastnameController.text.isEmpty ||
        ageController.text.isEmpty ||
        phoneNumberController.text.isEmpty ||
        isMale == null) {
      return;
    }

    try {
      FirebaseFirestore.instance
          .collection('admin')
          .doc('analytics')
          .get()
          .then((analyticsReference) {
        Map<String, dynamic> data = {};
        if (analyticsReference.data() != null) {
          data = analyticsReference.data() as Map<String, dynamic>;
        }
        String gender = isMale! ? 'male' : 'female';
        if (data[gender] != null) {
          data[gender] += 1;
        } else {
          data[gender] = 1;
        }
        FirebaseFirestore.instance
            .collection('admin')
            .doc('analytics')
            .set(data, SetOptions(merge: true));
      });

      await FirebaseAuth.instance
          .createUserWithEmailAndPassword(
              email: emailController.text.trim(),
              password: passwordController.text.trim())
          .then((user) {
        final configurationData = <String, dynamic>{
          'first_name': firstnameController.text.trim(),
          'last_name': lastnameController.text.trim(),
          'age': ageController.text.trim(),
          'phone_number': phoneNumberController.text.trim(),
          'gender': isMale! ? 'male' : 'female',
        };
        final usersRef = FirebaseFirestore.instance.collection('users');
        usersRef.doc(user.user!.uid).set(configurationData);
        FirebaseAnalytics.instance
            .logSignUp(signUpMethod: "email and password");
      });
    } on FirebaseAuthException catch (e) {
      showAlertDialog(context, e.toString());
    }
  }

  void openLogin() {
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.only(top: 50, left: 40, right: 40),
          child: Column(
            children: [
              SvgPicture.asset(
                'assets/adtour_logo.svg',
                height: 200,
              ),
              TextField(
                controller: firstnameController,
                textInputAction: TextInputAction.next,
                keyboardType: TextInputType.name,
                decoration: const InputDecoration(
                    hintText: 'First Name', labelText: 'First Name'),
              ),
              TextField(
                controller: lastnameController,
                textInputAction: TextInputAction.next,
                keyboardType: TextInputType.name,
                decoration: const InputDecoration(
                    hintText: 'Last Name', labelText: 'Last Name'),
              ),
              TextField(
                controller: ageController,
                textInputAction: TextInputAction.next,
                keyboardType: TextInputType.number,
                decoration:
                    const InputDecoration(hintText: 'Age', labelText: 'Age'),
              ),
              TextField(
                controller: phoneNumberController,
                textInputAction: TextInputAction.next,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                    hintText: 'Phone Number', labelText: 'Phone Number'),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Gender: ",
                    style: TextStyle(
                        fontSize: 16, color: Colors.black.withAlpha(150)),
                  ),
                  Row(
                    children: [
                      Checkbox(
                          value: isMale ?? false,
                          onChanged: (value) {
                            setState(() {
                              isMale = value;
                            });
                          }),
                      const Text('Male')
                    ],
                  ),
                  Row(
                    children: [
                      Checkbox(
                          value: isMale == null ? false : !isMale!,
                          onChanged: (value) {
                            setState(() {
                              isMale = !value!;
                            });
                          }),
                      const Text('Female')
                    ],
                  ),
                ],
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
                          onPressed: signUp, child: const Text("Login")))
                ],
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text("Already have an account?"),
                  TextButton(
                    onPressed: openLogin,
                    child: Text(
                      "Login",
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
