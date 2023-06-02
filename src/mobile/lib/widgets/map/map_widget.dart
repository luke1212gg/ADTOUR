import 'dart:io';
import 'dart:math';
import 'dart:typed_data';
import 'package:flutter/services.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/src/foundation/key.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:mapbox_gl/mapbox_gl.dart';

class MapWidget extends StatefulWidget {
  final double latitude;
  final double longitude;
  final String name;
  const MapWidget(
      {Key? key,
      required this.latitude,
      required this.longitude,
      required this.name})
      : super(key: key);

  static const String ACCESS_TOKEN =
      "pk.eyJ1Ijoibmp0YW4xNDIiLCJhIjoiY2w4d2pnZmZ6MG82dzN3cXZyb2FtOW1xZyJ9.G7-OEK4yKaaGEDjeYckmgA";
  @override
  State<MapWidget> createState() => _MapWidgetState();
}

class _MapWidgetState extends State<MapWidget> {
  MapboxMapController? mapController;
  var isLight = true;
  int _symbolCount = 0;
  LatLng? center;
  CameraPosition? _position;

  @override
  void initState() {
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.manual, overlays: []);
    center = LatLng(widget.latitude, widget.longitude);
    _position = CameraPosition(
      bearing: 0,
      target: LatLng(widget.latitude, widget.longitude),
      tilt: 0,
      zoom: 10.0,
    );
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();

    SystemChrome.setEnabledSystemUIMode(SystemUiMode.manual,
        overlays: SystemUiOverlay.values); // to re-show bars
  }

  _onMapCreated(MapboxMapController controller) {
    mapController = controller;
    onload();
  }

  _onStyleLoadedCallback() {
    _onStyleLoaded();
  }

  void onload() {
    mapController!.moveCamera(
      CameraUpdate.newCameraPosition(_position!),
    );
  }

  void setCenter() {
    mapController!.animateCamera(
      CameraUpdate.newCameraPosition(
        CameraPosition(
          bearing: 0,
          target: LatLng(widget.latitude, widget.longitude),
          tilt: 0,
          zoom: 15,
        ),
      ),
    );
  }

  Future<void> addImageFromAsset(String name, String assetName) async {
    final ByteData bytes = await rootBundle.load(assetName);
    final Uint8List list = bytes.buffer.asUint8List();
    return mapController!.addImage(name, list);
  }

  void _onStyleLoaded() {
    addImageFromAsset("assetImage", "assets/symbols/custom-icon.png")
        .then((value) {
      _add("assetImage");
    });
  }

  void _add(String iconImage) {
    List<int> availableNumbers = Iterable<int>.generate(12).toList();
    mapController!.symbols.forEach(
        (s) => availableNumbers.removeWhere((i) => i == s.data!['count']));
    if (availableNumbers.isNotEmpty) {
      mapController!.addSymbol(
          _getSymbolOptions(iconImage, availableNumbers.first),
          {'count': availableNumbers.first});
      setState(() {
        _symbolCount += 1;
      });
    }
  }

  SymbolOptions _getSymbolOptions(String iconImage, int symbolCount) {
    LatLng geometry = LatLng(
      center!.latitude,
      center!.longitude + cos(symbolCount * pi / 2.0) / 20000.0,
    );
    return iconImage == 'customFont'
        ? SymbolOptions(
            geometry: geometry,
            iconImage: 'airport-15',
            fontNames: ['DIN Offc Pro Bold', 'Arial Unicode MS Regular'],
            textField: 'Airport',
            textSize: 12.5,
            textOffset: Offset(0, 0.8),
            textAnchor: 'top',
            textColor: '#000000',
            textHaloBlur: 1,
            textHaloColor: '#ffffff',
            textHaloWidth: 0.8,
          )
        : SymbolOptions(
            geometry: geometry,
            textField: widget.name,
            textOffset: Offset(0, 0.8),
            iconImage: iconImage,
          );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: const Text("Maps")),
        body: Center(
          child: Stack(alignment: AlignmentDirectional.bottomStart, children: [
            Padding(
              padding: const EdgeInsets.only(top: 0),
              child: Container(
                child: MapboxMap(
                  styleString: isLight
                      ? MapboxStyles.MAPBOX_STREETS
                      : MapboxStyles.MAPBOX_STREETS,
                  accessToken: MapWidget.ACCESS_TOKEN,
                  onMapCreated: _onMapCreated,
                  initialCameraPosition: const CameraPosition(
                      target: LatLng(7.09598768787, 125.623103191)),
                  onStyleLoadedCallback: _onStyleLoadedCallback,
                  myLocationEnabled: true,
                ),
              ),
            ),
            Positioned(
                bottom: 0,
                right: 10,
                child: Column(
                  children: [
                    ElevatedButton(
                      child: Text("+"),
                      onPressed: (() {
                        mapController!.animateCamera(
                          CameraUpdate.zoomIn(),
                        );
                      }),
                    ),
                    ElevatedButton(
                      child: Text("-"),
                      onPressed: (() {
                        mapController!.animateCamera(
                          CameraUpdate.zoomOut(),
                        );
                      }),
                    ),
                    ElevatedButton(
                      child: Text("⟳"),
                      onPressed: (() {
                        setCenter();
                      }),
                    ),
                  ],
                )),
          ]),
        ));
  }
}
