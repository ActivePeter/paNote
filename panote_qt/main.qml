import QtQuick 2.12
import QtQuick.Window 2.12

Window {
    width: 640
    height: 480
    visible: true
    title: qsTr("Hello World")

    property double painterX: 0
    property double painterY: 0
    property double _scale: 1
    property var moving_target : null


    MouseArea{
        property double lMouseX: 0
        property double lMouseY: 0
        property var gMouse: null
        function isPainterDragging(){
            return  gMouse.modifiers===Qt.ControlModifier
        }

        id:mouseArea;
        anchors.fill: parent;
        acceptedButtons: Qt.LeftButton | Qt.RightButton;



        onPressed: {
            gMouse=mouse
            lMouseX=mouse.x
            lMouseY=mouse.y
//            dragging=true
        }
        onReleased: {
            moving_target=null
//            console.debug("moving_target null")
        }

        onMouseXChanged:{
            if(isPainterDragging()){
                painterX+=mouse.x-lMouseX
//                lMouseX=mouse.x
            }
            else{
                if(moving_target){
                    moving_target.rec_x+=(mouse.x-lMouseX)/_scale
                }
            }
            lMouseX=mouse.x
        }
        onMouseYChanged: {
            if(isPainterDragging()){
                painterY+=mouse.y-lMouseY
            }
            else{
                if(moving_target){
//                    moving_target.rec_x+=(mouse.x-lMouseX)/_scale
                    moving_target.rec_y+=(mouse.y-lMouseY)/_scale
                }
            }

            lMouseY=mouse.y
        }
        onWheel: {
            if(isPainterDragging()){

                var scale1 =_scale;
                scale1+=wheel.angleDelta.y/2000.0;

                if(scale1>2)
                    scale1=2
                if(scale1<0.5)
                    scale1=0.5

                console.debug(wheel.angleDelta.y,scale1)

                _scale=scale1
            }
        }
    }
    Rectangle {
        color: "red"
        x: painterX; y:painterY; width: 500; height:500
        Rectangle {
            id:child_rec1
            property double rec_x: 0
            property double rec_y: 0

            color: "blue"
            x: rec_x; y:rec_y; width: 100; height:100
            MouseArea{
                property double lMouseX1: 0
                property double lMouseY1: 0
                property bool dragging1: false

                propagateComposedEvents: true
                id:bar_mouseArea;
                anchors.fill: parent;
                acceptedButtons: Qt.LeftButton | Qt.RightButton;


                onPressed: {
                    mouse.accepted = false
                    if(mouse.modifiers===Qt.NoModifier){
                        moving_target=parent
                    }
                }
                onMouseXChanged: {
                    mouse.accepted = false
                }
                onMouseYChanged: {
                    mouse.accepted = false
                }

            }
        }
        scale: _scale  //放大1.6倍显示
//        rotation: 30    //选择30度
        Text{
            text: "Hello World!"
        }
    }

}
