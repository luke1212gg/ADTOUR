import 'package:android_app/widgets/profile/profile_picture_edit_widget.dart';
import 'package:flutter/material.dart';

class ProfilePictureView extends StatefulWidget {
  final String profileURL;
  const ProfilePictureView({Key? key, required this.profileURL})
      : super(key: key);

  @override
  State<ProfilePictureView> createState() => _ProfilePictureViewState();
}

class _ProfilePictureViewState extends State<ProfilePictureView> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Profile"),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Image.network(
              widget.profileURL,
              height: 500,
            ),
            Padding(
              padding: const EdgeInsets.only(bottom: 50, left: 10, right: 10),
              child: Row(
                children: [
                  Expanded(
                      child: ElevatedButton(
                    child: const Text("Edit Profile"),
                    onPressed: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) =>
                                  const ProfilePictureEditWidget()));
                    },
                  ))
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
