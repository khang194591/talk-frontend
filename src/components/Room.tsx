// import { Button } from "antd";
// import { useContext } from "react";
// import { useLocation } from "react-router-dom";
// import { RoomContext } from "../contexts/roomContext";

// export default function Room() {
//   const { pathname: roomId } = useLocation();
//   // const [activeCamera, setActiveCamera] = useState(false);
//   // const [activeMicro, setActiveMicro] = useState(false);

//   const { localRef, noDevices, remoteRef, joinRoomById, hangUp } =
//     useContext(RoomContext);

//   return (
//     <div className="grid grid-cols-2">
//       <div style={{ display: !roomId ? "none" : "block" }}>
//         <p className="text-2xl">{roomId}</p>
//         <Button onClick={() => joinRoomById(roomId)}>Start</Button>
//         <Button onClick={() => hangUp()}>Hang up</Button>
//         {noDevices ? (
//           <div className="aspect-video h-96 bg-white border rounded-lg">
//             No devices
//           </div>
//         ) : (
//           <video
//             ref={localRef}
//             autoPlay
//             playsInline
//             className="aspect-video h-96 bg-white border rounded-lg -scale-x-100"
//             muted
//           />
//         )}
//         <video
//           ref={remoteRef}
//           autoPlay
//           playsInline
//           className="aspect-video h-96 bg-white border rounded-lg transform -scale-x-100"
//         />
//       </div>
//       {/* <Videos /> */}
//     </div>
//   );
// }
