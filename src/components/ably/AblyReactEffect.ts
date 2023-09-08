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
  

  useEffect(()=> {

    onMount();
    return () => onUnmount();
  }, [])

  if (!chanelNameState)
    return 

  const channel = ably.channels.get(channelName);

  const onMount = () => {
    void channel.subscribe((msg) => {
      callbackOnMessage(msg);
    });
  };

  const onUnmount = () => {
    channel.unsubscribe();
  };
  



  return [channel, ably];
}
