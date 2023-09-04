import Ably from "ably/promises";
import { useEffect, useMemo } from "react";

const ably = new Ably.Realtime.Promise({ authUrl: "/api/createTokenRequest.js" });

export function useChannel(channelName, callbackOnMessage) {

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

  const onMount = () => {
    channel.subscribe((msg) => {
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
