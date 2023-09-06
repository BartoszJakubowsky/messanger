import Ably from "ably/promises";
import { useEffect, useMemo } from "react";

const ably = new Ably.Realtime.Promise({ authUrl: "/api/createTokenRequest.js" });

export function useChannel(channelName : string, callbackOnMessage : (msg: Ably.Types.Message) => void) {

  const chanelNameState = useMemo(()=>{
    if (!channelName)
      return false
    else 
      return true
  },[channelName])

  console.log(chanelNameState);
  if (!chanelNameState)
    return 

  const channel = ably.channels.get(channelName);

  const onMount = async() => {
    await channel.subscribe((msg) => {
      callbackOnMessage(msg);
    });
  };

  const onUnmount = () => {
    channel.unsubscribe();
  };
  
  useEffect(()=> {
    onMount();
    return () => {
      onUnmount();
    };
  }, [])


  return [channel, ably];
}
