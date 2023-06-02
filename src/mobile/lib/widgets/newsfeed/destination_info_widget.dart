import 'dart:async';

import 'package:android_app/custom_arts.dart';
import 'package:android_app/widgets/newsfeed/classifier.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter/material.dart';
import 'package:flutter_speed_dial/flutter_speed_dial.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../map/map_widget.dart';

class DestinationInfoWidget extends StatefulWidget {
  final Map<String, dynamic> data;
  final String id;
  final CollectionReference collectionReference;
  const DestinationInfoWidget(
      {Key? key,
      required this.data,
      required this.id,
      required this.collectionReference})
      : super(key: key);

  @override
  State<DestinationInfoWidget> createState() => _DestinationInfoWidgetState();
}

class _DestinationInfoWidgetState extends State<DestinationInfoWidget> {
  final Classifier _classifier = Classifier();
  late Stream<QuerySnapshot> _destinationsStream;
  Widget comments = const Center(
    child: CircularProgressIndicator(),
  );
  Timer? timer;

  @override
  void initState() {
    DateTime today = DateTime.now();
    FirebaseFirestore.instance
        .collection('admin')
        .doc('analytics')
        .get()
        .then((analyticsReference) {
      Map<String, dynamic> data = {};
      if (analyticsReference.data() != null) {
        data = analyticsReference.data() as Map<String, dynamic>;
      }
      if (data['destination_views'] != null) {
        data['destination_views'] += 1;
      } else {
        data['destination_views'] = 1;
      }
      FirebaseFirestore.instance
          .collection('admin')
          .doc('analytics')
          .set(data, SetOptions(merge: true))
          .then((value) {
        FirebaseFirestore.instance
            .collection('admin')
            .doc('analytics')
            .collection('destination_views')
            .doc("${today.year}-${today.month}-${today.day}")
            .get()
            .then((analyticsReference) {
          Map<String, dynamic> data = {};
          if (analyticsReference.data() != null) {
            data = analyticsReference.data() as Map<String, dynamic>;
          }
          if (data['destination_views'] != null) {
            data['destination_views'] += 1;
          } else {
            data['destination_views'] = 1;
          }
          FirebaseFirestore.instance
              .collection('admin')
              .doc('analytics')
              .collection('destination_views')
              .doc("${today.year}-${today.month}-${today.day}")
              .set(data, SetOptions(merge: true));
        });
      });
    });
    _destinationsStream = widget.collectionReference.snapshots();
    timer = Timer.periodic(
        const Duration(seconds: 1), (Timer t) => checkIfLoaded());
    FirebaseAnalytics.instance
        .logEvent(name: "Destination Views")
        .then((value) {});
    FirebaseAnalytics.instance.logScreenView(screenName: "Destination Info");
    FirebaseAnalytics.instance.setCurrentScreen(screenName: "Destination Info");
    super.initState();
  }

  void checkIfLoaded() {
    if (_classifier.loaded == 2) {
      setState(() {
        comments = getComments(context);
      });
      _classifier.loaded = 0;
    }
  }

  Widget _buildComment(
      BuildContext context, String uid, Map<String, dynamic> data) {
    return StreamBuilder<DocumentSnapshot<Map<String, dynamic>>>(
      stream: FirebaseFirestore.instance
          .collection('users')
          .doc(uid)
          .get()
          .asStream(),
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          final prediction = _classifier.classify(data['comment']);
          Map<String, dynamic> userData = snapshot.data!.data()!;
          return Padding(
            padding: const EdgeInsets.only(bottom: 20),
            child: Card(
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(40)),
              child: Container(
                padding: const EdgeInsets.all(30),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Row(
                      children: [
                        SizedBox(
                          width: 30,
                          height: 30,
                          child: userData['profile_url'] == null
                              ? const CircleAvatar(
                                  backgroundImage: AssetImage(
                                      'assets/image_unavailable.jpg'))
                              : CircleAvatar(
                                  backgroundImage:
                                      NetworkImage(userData['profile_url'])),
                        ),
                        const SizedBox(
                          width: 15,
                        ),
                        Text(
                          userData['first_name'],
                          style: TextStyle(color: profileNameColor),
                        ),
                        const SizedBox(
                          width: 30,
                        ),
                        Text(
                          (data['uploaded'] as Timestamp)
                              .toDate()
                              .toString()
                              .split(" ")[0],
                          style: TextStyle(
                              fontSize: 12, color: commentTimestampColor),
                        ),
                      ],
                    ),
                    const SizedBox(
                      height: 20,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          flex: 2,
                          child: Container(
                            alignment: Alignment.centerLeft,
                            child: Text(
                              '"' + data['comment'] + '"',
                              style: const TextStyle(fontSize: 14),
                            ),
                          ),
                        ),
                        Container(
                          alignment: Alignment.center,
                          width: 75,
                          child: Text(
                            prediction[1] > prediction[0]
                                ? "Positive"
                                : "Negative",
                            style: TextStyle(
                                color: prediction[1] > prediction[0]
                                    ? positiveFeedbackColor
                                    : negativeFeedbackColor),
                          ),
                        )
                      ],
                    ),
                  ],
                ),
              ),
            ),
          );
        } else {
          return Container();
        }
      },
    );
  }

  Widget getComments(BuildContext context) {
    return StreamBuilder<QuerySnapshot>(
      stream: _destinationsStream,
      builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
        if (snapshot.hasData) {
          return ListView(
            physics: const NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            padding: const EdgeInsets.only(left: 20, top: 50, right: 20),
            children: snapshot.data!.docs.map((DocumentSnapshot document) {
              Map<String, dynamic> data =
                  document.data()! as Map<String, dynamic>;
              return _buildComment(context, data['user_id'], data);
            }).toList(),
          );
        }

        return const Center(
          child: CircularProgressIndicator(),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
          child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          widget.data["image_url"] == null
              ? Image.asset('assets/image_unavailable.jpg')
              : Image.network(
                  widget.data["image_url"],
                  fit: BoxFit.cover,
                ),
          const SizedBox(
            height: 30,
          ),
          Padding(
            padding: const EdgeInsets.only(left: 20, right: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.data["name"],
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 24),
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Container(
                      decoration: BoxDecoration(
                          border: Border.all(
                              color: categoryInfoTypeColor, width: 2),
                          borderRadius: BorderRadius.circular(50)),
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Text(
                          widget.collectionReference.path
                              .split('/')[1]
                              .toUpperCase(),
                          style: TextStyle(color: categoryInfoTypeColor),
                        ),
                      )),
                ),
                const SizedBox(
                  height: 10,
                ),
                Text(
                  'What is it all about?',
                  style: TextStyle(
                      color: whatIsThisAllAboutTextColor,
                      fontSize: 18,
                      fontWeight: FontWeight.bold),
                ),
                const SizedBox(
                  height: 7,
                ),
                const Text('Description',
                    style:
                        TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(
                  height: 5,
                ),
                Text(
                  widget.data["description"],
                ),
                const SizedBox(
                  height: 20,
                ),
                const Text('Address',
                    style:
                        TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(
                  height: 7,
                ),
                Text(widget.data['location'])
              ],
            ),
          ),
          const SizedBox(
            height: 50,
          ),
          const Text(
            "Reviews",
            style: TextStyle(fontSize: 30),
          ),
          Flexible(
            child: comments,
          )
        ],
      )),
      floatingActionButton: SpeedDial(
        animatedIcon: AnimatedIcons.menu_close,
        animatedIconTheme: IconThemeData(
            size: 22, color: destinationInfoFloatingButtonIconColor),
        backgroundColor: destinationInfoFloatingButtonBGColor,
        curve: Curves.bounceIn,
        spacing: 15,
        spaceBetweenChildren: 15,
        children: [
          SpeedDialChild(
            child: const FaIcon(FontAwesomeIcons.map),
            label: 'Open Maps',
            onTap: () {
              Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => MapWidget(
                            latitude: double.parse(widget.data['latitude']),
                            longitude: double.parse(widget.data['longitude']),
                            name: widget.data["name"],
                          )));
            },
          ),
        ],
      ),
    );
  }
}
