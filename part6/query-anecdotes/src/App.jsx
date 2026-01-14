import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import QuoteForm from "./components/QuoteForm"
import Notifications from "./components/Notifications"
import quoteService from "./services/quotes"
import { useNotificationHandler } from "./context/NotificationsContext"

const App = () => {
  const queryClient = useQueryClient()
  const notificationHandler = useNotificationHandler()

  const updateQuoteMutation = useMutation({
    mutationFn: quoteService.updateQuote,
    onSuccess: (updatedQuote) => {
      const quotes = queryClient.getQueryData(['quotes'])
      queryClient.setQueryData(
        ['quotes'],
        quotes.map((quote) =>
          quote.id === updatedQuote.id ? updatedQuote : quote
        )
      )
      const id = Math.floor(Math.random() * 1000000)
      notificationHandler({ content: `you voted '${updatedQuote.content}'`, id })
    }
  })

  const handleVote = (quote) => {
    updateQuoteMutation.mutate({ ...quote, votes: quote.votes + 1 });
  };

  const { isLoading, isError, data } = useQuery({
    queryKey: ["quotes"],
    queryFn: quoteService.getQuotes,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>loading data...</div>;
  }

  if (isError) {
    return <div>quote service not available due to problems in server</div>;
  }

  return (
    <div>
      <h3>Quote app</h3>

      <Notifications />
      <QuoteForm />

      {data.map((quote) => (
        <div key={quote.id}>
          <div>{quote.content}</div>
          <div>
            has {quote.votes}
            <button onClick={() => handleVote(quote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
