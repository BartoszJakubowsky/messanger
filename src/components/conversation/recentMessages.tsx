
import InfiniteMessagesList from "~/components/ui/InfiniteMessagesList";
import { api } from "~/utils/api"


export default function RecentMessages({conversationId}: {conversationId: string}) {

    const messages = api.conversation.infiniteMessage.useInfiniteQuery(
        {conversationId},
        {getNextPageParam: (lastScrollPage) => {
          if (Array.isArray(lastScrollPage)  || !lastScrollPage)
            return null;
          else
            return lastScrollPage.nextCursor;
        }});
    
    
    
      const messagesData = messages.data?.pages.flatMap((arrOfMessagesArr) =>
      Array.isArray(arrOfMessagesArr) || !arrOfMessagesArr
        ? []
        : arrOfMessagesArr.messages.map((message) => ({
            ...message,
            children: message.content, 
          }))
      );
    return (
      <InfiniteMessagesList
        data={messagesData}
        isError={messages.isError}
        isLoading={messages.isLoading}
        hasMore={messages.hasNextPage}
        fetchNewData={messages.fetchNextPage}
      />
    );
  }
