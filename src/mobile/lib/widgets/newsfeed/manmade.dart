import 'package:android_app/custom_arts.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../widget_builder.dart';

class ManMadeNewsfeedWidget extends StatefulWidget {
  const ManMadeNewsfeedWidget({Key? key}) : super(key: key);

  @override
  State<ManMadeNewsfeedWidget> createState() => _ManMadeNewsfeedWidgetState();
}

class _ManMadeNewsfeedWidgetState extends State<ManMadeNewsfeedWidget> {
  final User user = FirebaseAuth.instance.currentUser!;
  Map<String, dynamic> userData = {'profile_url': null};
  final TextEditingController searchController = TextEditingController();
  List<QueryDocumentSnapshot<Object?>> destinations = [];
  List<QueryDocumentSnapshot<Object?>>? searchList;

  @override
  void dispose() {
    searchController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    FirebaseFirestore.instance
        .collection('users')
        .doc(user.uid)
        .get()
        .then((data) {
      setState(() {
        if (data.exists) {
          userData = data.data()!;
        }
      });
    });
    super.initState();
  }

  void initSearchList() {
    if (searchList != null) {
      return;
    }
    setState(() {
      searchList = destinations;
    });
  }

  final Stream<QuerySnapshot> _destinationsStream = FirebaseFirestore.instance
      .collection('LocationsData')
      .doc('manmade')
      .collection('destinations')
      .snapshots();

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot>(
      stream: _destinationsStream,
      builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
        if (snapshot.hasError) {
          return const Text('Something went wrong');
        }

        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        }

        if (snapshot.hasData) {
          Future.delayed(Duration.zero, () async {
            setState(() {
              destinations = snapshot.data!.docs;
            });
            initSearchList();
          });
          return Scaffold(
            appBar: AppBar(
              automaticallyImplyLeading: false,
              backgroundColor: bgColor,
              elevation: 0,
              toolbarHeight: 80,
              systemOverlayStyle: SystemUiOverlayStyle.light,
              title: displayProfile(context, userData),
              actions: [
                SizedBox(
                  width: 150,
                  child: TextField(
                    textAlignVertical: TextAlignVertical.bottom,
                    controller: searchController,
                    onChanged: (value) {
                      List<QueryDocumentSnapshot<Object?>> searched =
                          destinations.where((element) {
                        return ((element.data() as Map<String, dynamic>)['name']
                            .toString()
                            .toLowerCase()
                            .contains(searchController.text.toLowerCase()));
                      }).toList();

                      setState(() {
                        searchList = searched;
                      });
                    },
                  ),
                ),
                IconButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  icon: const FaIcon(FontAwesomeIcons.house),
                  color: accentColor,
                  iconSize: 19,
                )
              ],
            ),
            body: Column(
              children: [
                const SizedBox(
                  height: 20,
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 20),
                  child: Row(
                    children: const [
                      Text(
                        "Explore",
                        style: TextStyle(fontSize: 35),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: GridView.builder(
                    padding:
                        const EdgeInsets.only(left: 20, top: 50, right: 20),
                    itemCount: searchList == null ? 0 : searchList!.length,
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: (2 / 3),
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 10,
                    ),
                    itemBuilder: (context, index) {
                      return createDestinationCard(context, searchList, index);
                    },
                  ),
                ),
              ],
            ),
          );
        }

        return const Center(
          child: CircularProgressIndicator(),
        );
      },
    );
  }
}
