import 'dart:io';
import 'package:android_app/widgets/restart.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class ProfilePictureEditWidget extends StatefulWidget {
  const ProfilePictureEditWidget({Key? key}) : super(key: key);

  @override
  State<ProfilePictureEditWidget> createState() =>
      _ProfilePictureEditWidgetState();
}

class _ProfilePictureEditWidgetState extends State<ProfilePictureEditWidget> {
  File? image;

  Future pickImage() async {
    final image = await ImagePicker().pickImage(source: ImageSource.gallery);
    if (image == null) return;

    final imageTemporary = File(image.path);
    setState(() {
      this.image = imageTemporary;
    });
  }

  Future pickCamera() async {
    final image = await ImagePicker().pickImage(source: ImageSource.camera);
    if (image == null) return;

    final imageTemporary = File(image.path);
    setState(() {
      this.image = imageTemporary;
    });
  }

  Future uploadProfilePicture() async {
    final id = FirebaseAuth.instance.currentUser!.uid;
    final path = "Profiles/$id";
    final file = image;
    final ref = FirebaseStorage.instance.ref().child(path);
    ref.putFile(file!).then((p0) {
      ref.getDownloadURL().then((url) {
        FirebaseFirestore.instance
            .collection('users')
            .doc(id)
            .set({"profile_url": url}, SetOptions(merge: true)).then((value) {
          RestartWidget.restartApp(context);
          // Navigator.pushReplacement(context,
          //     MaterialPageRoute(builder: (context) => const HomeWidget()));
        });
      });
    });
  }

  // AIzaSyCQm2joznmHFotP1VbST9gmfjUJuWb5wIE

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Edit Profile")),
      body: Center(
          child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          image != null
              ? Image.file(
                  image!,
                  height: 300,
                )
              : const SizedBox(
                  height: 300,
                ),
          const SizedBox(height: 20),
          ElevatedButton(
              onPressed: pickImage, child: const Text("From Gallery")),
          ElevatedButton(
              onPressed: pickCamera, child: const Text("From Camera")),
          const SizedBox(
            height: 50,
          ),
          image != null
              ? Padding(
                  padding: const EdgeInsets.only(left: 30.0, right: 30.0),
                  child: Row(
                    children: [
                      Expanded(
                          child: ElevatedButton(
                              onPressed: uploadProfilePicture,
                              child: const Text("Submit"))),
                    ],
                  ),
                )
              : Row(),
        ],
      )),
    );
  }
}
