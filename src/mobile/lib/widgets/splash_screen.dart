import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../main.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    FirebaseAnalytics.instance.logAppOpen();
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _navigateToHome());
  }

  _navigateToHome() async {
    await Future.delayed(const Duration(seconds: 3), () {});
    _moveToHome();
  }

  _moveToHome() {
    Navigator.pushReplacement(
        context,
        MaterialPageRoute(
            builder: (context) => const MyHomePage(title: 'Adtour')));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
            child: Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [SvgPicture.asset('assets/adtour_logo.svg')],
      ),
    )));
  }
}
