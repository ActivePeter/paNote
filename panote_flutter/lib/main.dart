import 'dart:ffi';

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:vector_math/vector_math_64.dart' as v;

import 'patest.dart' as patest;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or simply save your changes to "hot reload" in a Flutter IDE).
        // Notice that the counter didn't reset back to zero; the application
        // is not restarted.
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;
  // Pos pos = Pos();
  // Offset offset = Offset(0, 0);
  double dx = 0, dy = 0;
  double map_dx = 0, map_dy = 0;
  bool scaling = false;
  double scale = 1;
  double scale_dx = 0, scale_dy = 0;
  bool dragging = false;
  Matrix4 matrix = Matrix4.identity();
  FocusNode _focusNode = FocusNode();
  patest.DragScaleArea dragScaleArea = patest.DragScaleArea();
  void _incrementCounter() {
    setState(() {
      // This call to setState tells the Flutter framework that something has
      // changed in this State, which causes it to rerun the build method below
      // so that the display can reflect the updated values. If we changed
      // _counter without calling setState(), then the build method would not be
      // called again, and so nothing would appear to happen.
      _counter++;
    });
  }

  Container main_container() {
    return Container(
        color: Colors.red.shade50,
        constraints: BoxConstraints(
            minWidth: double.infinity, minHeight: double.infinity),
        child: Stack(
          children: [
            Transform(
              transform: matrix,
              child: Container(
                  width: 500,
                  height: 500,
                  color: Colors.blue.shade50,
                  child: Stack(
                    children: [
                      Positioned(
                        left: dx,
                        top: dy,
                        child: dragCard(),
                      )
                    ],
                  )),
            ),
          ],
        ));
  }

  Listener dragCard() {
    return Listener(
        onPointerMove: (s) {
          if (!scaling) {
            setState(() {
              dx += s.delta.dx / scale;
              dy += s.delta.dy / scale;
            });
          }
        },
        child: MouseRegion(
          cursor: SystemMouseCursors.click,
          child: Container(
            width: 200,
            height: 200,
            color: Colors.yellow.shade50,
            child: TextField(
              decoration: new InputDecoration(
                  // labelText: "请输入密码",
                  // icon: Icon(Icons.lock),
                  // helperText: "带图标和label的密码输入框",
                  ),
            ),
          ),
        ));
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    _focusNode.requestFocus();
  }

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    return dragScaleArea.build_test(context);
    // Initialize a stream for the KeyEvents:
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    return Scaffold(
      // appBar: AppBar(
      //   // Here we take the value from the MyHomePage object that was created by
      //   // the App.build method, and use it to set our appbar title.
      //   title: Text(widget.title),
      // ),
      body: MouseRegion(
        cursor: scaling ? SystemMouseCursors.click : SystemMouseCursors.grab,
        child: Listener(
            onPointerSignal: (s) {
              if (s is PointerScrollEvent) {
                if (scaling) {
                  var scale2 = scale;
                  print("object $s.scrollDelta");
                  scale2 += s.scrollDelta.dy / 150;
                  if (scale2 > 1.1) {
                    scale2 = 1.1;
                  }
                  if (scale2 < 0.3) {
                    scale2 = 0.3;
                  }
                  scale_dx = s.localPosition.dx;
                  scale_dy = s.localPosition.dy;

                  var dscale = scale2 / scale;
                  scale = scale2;

                  setState(() {
                    matrix = (Matrix4.identity()..translate(scale_dx, scale_dy))
                      ..multiply(Matrix4.identity()..scale(dscale))
                      ..multiply(
                          Matrix4.identity()..translate(-scale_dx, -scale_dy))
                      ..multiply(matrix);
                  });
                }
              }

              // if (s is PointerDownEvent) {
              // dragging = s.down;
              // }
            },
            onPointerDown: (s) {
              if (s.down) {
                dragging = true;
              }
            },
            onPointerUp: (s) {
              if (!s.down) {
                dragging = false;
              }
            },
            onPointerMove: (s) {
              // print('move $s');
              if (scaling) {
                setState(() {
                  map_dx += s.delta.dx;
                  map_dy += s.delta.dy;
                  matrix.translate(s.delta.dx / scale, s.delta.dy / scale);
                });
              }
            },
            child: RawKeyboardListener(
              child: main_container(),
              focusNode: _focusNode,
              onKey: (e) {
                setState(() {
                  scaling = e.isKeyPressed(LogicalKeyboardKey.alt) ||
                      e.isKeyPressed(LogicalKeyboardKey.altLeft) ||
                      e.isKeyPressed(LogicalKeyboardKey.altRight);
                  print(scaling);
                });
              },
            )),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}
