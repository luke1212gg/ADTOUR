import 'dart:async';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:location/location.dart';
import 'package:maps_toolkit/maps_toolkit.dart';

import '../custom_arts.dart';
import 'configuration.dart';
import 'newsfeed/cultural.dart';
import 'newsfeed/destination_confirmation.dart';
import 'newsfeed/manmade.dart';
import 'newsfeed/special_interest.dart';
import 'widget_builder.dart';

class HomeWidget extends StatefulWidget {
  const HomeWidget({Key? key}) : super(key: key);

  @override
  State<HomeWidget> createState() => _HomeWidgetState();
}

class _HomeWidgetState extends State<HomeWidget> {
  final User user = FirebaseAuth.instance.currentUser!;
  Map<String, dynamic> userData = {'profile_url': null};
  List<QueryDocumentSnapshot> destinationInfos = <QueryDocumentSnapshot>[];
  List<LatLng> destinationPositions = <LatLng>[];
  Map<String, dynamic>? closestLocation;
  Timer? timer;
  ValueNotifier<bool> isDialOpen = ValueNotifier(false);

  final num ideadDistance = 114280160;
  List<Map<String, dynamic>> closeLocations = [];

  Future<List<LatLng>> getLocationsFromCollection(String category) async {
    CollectionReference collectionRef = FirebaseFirestore.instance
        .collection('LocationsData')
        .doc(category)
        .collection("destinations");

    QuerySnapshot querySnapshot = await collectionRef.get();

    // Get data from docs and convert map to List
    final collectionDestinations = querySnapshot.docs.map((doc) {
      Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
      if (mounted) {
        setState(() {
          destinationInfos.add(doc);
        });
      }
      return LatLng(
          double.parse(data['latitude']), double.parse(data['longitude']));
    }).toList();

    return collectionDestinations;
  }

  Future<void> getLocations() async {
    final culturalDesinations = await getLocationsFromCollection("cultural");
    final manmadeDesinations = await getLocationsFromCollection("manmade");
    final specialinterestDesinations =
        await getLocationsFromCollection("specialinterest");
    final allData =
        culturalDesinations + manmadeDesinations + specialinterestDesinations;

    if (mounted) {
      setState(() {
        destinationPositions = allData;
      });
    }
  }

  Future<void> getUserLocation() async {
    if (destinationPositions.isEmpty) {
      return;
    }
    Location location = Location();

    bool serviceEnabled;
    PermissionStatus permissionGranted;

    serviceEnabled = await location.serviceEnabled();
    if (!serviceEnabled) {
      serviceEnabled = await location.requestService();
      if (!serviceEnabled) {
        return;
      }
    }

    permissionGranted = await location.hasPermission();
    if (permissionGranted == PermissionStatus.denied) {
      permissionGranted = await location.requestPermission();
      if (permissionGranted != PermissionStatus.granted) {
        return;
      }
    }

    List<Map<String, dynamic>> newcloseLocations = [];

    LocationData locationData;

    locationData = await location.getLocation();
    LatLng locationPosition =
        LatLng(locationData.latitude!, locationData.longitude!);

    destinationPositions.asMap().forEach((index, value) {
      num distance =
          SphericalUtil.computeDistanceBetween(locationPosition, value);
      if (distance <= ideadDistance) {
        Map<String, dynamic> destinationData =
            destinationInfos[index].data() as Map<String, dynamic>;
        LatLng destinationPosition = destinationPositions[index];
        newcloseLocations.add({
          'location_name': destinationData['name'],
          'distance': distance / 1000,
          'data': destinationData,
          'id': destinationInfos[index].id,
          'latitude': destinationPosition.latitude,
          'longitude': destinationPosition.longitude,
          'comments': destinationInfos[index].reference.collection('comments')
        });
      }
    });

    setState(() {
      closeLocations = newcloseLocations;
    });
  }

  void checkConfigured() {
    if (userData['tourist_type'] == null) {
      timer!.cancel();
      Navigator.pushReplacement(
          context,
          MaterialPageRoute(
              builder: (context) => ConfigurationWidget(
                    uid: user.uid,
                  )));
    }
  }

  Future<void> logLoginEvent() async {
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
      if (data['logins'] != null) {
        data['logins'] += 1;
      } else {
        data['logins'] = 1;
      }
      FirebaseFirestore.instance
          .collection('admin')
          .doc('analytics')
          .set(data, SetOptions(merge: true))
          .then((value) {
        FirebaseFirestore.instance
            .collection('admin')
            .doc('analytics')
            .collection('logins')
            .doc("${today.year}-${today.month}-${today.day}")
            .get()
            .then((analyticsReference) {
          Map<String, dynamic> data = {};
          if (analyticsReference.data() != null) {
            data = analyticsReference.data() as Map<String, dynamic>;
          }
          if (data['logins'] != null) {
            data['logins'] += 1;
          } else {
            data['logins'] = 1;
          }
          FirebaseFirestore.instance
              .collection('admin')
              .doc('analytics')
              .collection('logins')
              .doc("${today.year}-${today.month}-${today.day}")
              .set(data, SetOptions(merge: true));
        });
      });
    });
  }

  void initializeUserData() {
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
      checkConfigured();
    });
  }

  @override
  void initState() {
    initializeUserData();
    logLoginEvent();
    getLocations();
    timer = Timer.periodic(
        const Duration(seconds: 5), (Timer t) => getUserLocation());
    super.initState();
  }

  void signOut() {
    timer!.cancel();
    FirebaseAuth.instance.signOut();
  }

  Future openDialog() async {
    print(closeLocations.length);
    return showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text("Nearest Tourism Destinations"),
        content: Container(
          height: 500,
          width: 300,
          child: ListView.builder(
            itemCount: closeLocations.length,
            itemBuilder: (BuildContext context, index) {
              Map<String, dynamic> closeLocation = closeLocations[index];
              return ListTile(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => DestinationConfirmationWidget(
                        data: closeLocation["data"],
                        id: closeLocation["id"],
                        collectionReference: closeLocation["comments"],
                      ),
                    ),
                  );
                },
                title: Text(closeLocation["location_name"]),
                trailing:
                    Text(closeLocation["distance"].toString().split(".")[0]),
              );
            },
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: bgColor,
        elevation: 0,
        toolbarHeight: 80,
        systemOverlayStyle: SystemUiOverlayStyle.light,
        title: displayProfile(context, userData),
        actions: [
          IconButton(
            onPressed: signOut,
            icon: const FaIcon(FontAwesomeIcons.arrowRightFromBracket),
            color: accentColor,
            iconSize: 19,
          )
        ],
      ),
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 15, top: 30, right: 15),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Explore",
                  style: GoogleFonts.nunitoSans(
                      fontSize: 40, fontWeight: FontWeight.w600),
                ),
                Expanded(
                  child: GridView.count(
                    primary: false,
                    padding: const EdgeInsets.all(20),
                    crossAxisSpacing: 10,
                    mainAxisSpacing: 10,
                    crossAxisCount: 2,
                    children: [
                      createCategoryCard(
                          context, const CulturalNewsfeedWidget(), "Cultural"),
                      createCategoryCard(
                          context, const ManMadeNewsfeedWidget(), "Manmade"),
                      createCategoryCard(
                          context,
                          const SpecialInterestNewsfeedWidget(),
                          "Special Interest"),
                    ],
                  ),
                )
              ],
            ),
          ),
          Positioned(
              bottom: 0,
              left: 0,
              child: GestureDetector(
                onTap: openDialog,
                child: Card(
                  color: const Color.fromARGB(255, 68, 171, 255),
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: SizedBox(
                      child: Column(
                        children: [
                          Row(
                            children: [
                              const Text("Nearest Tourism Destinations:"),
                              Text(closeLocations.length.toString()),
                            ],
                          )
                        ],
                      ),
                    ),
                  ),
                ),
              )),
        ],
      ),
    );
  }
}
