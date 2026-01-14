import { useMutation, useQueryClient } from "@tanstack/react-query";
import quoteService from "../services/quotes";
import { useNotificationHandler } from "../context/NotificationsContext";

const QuoteForm = () => {
  const queryClient = useQueryClient();
  const notificationHandler = useNotificationHandler();

  const createQuoteMutation = useMutation({
    mutationFn: quoteService.createQuote,
    onSuccess: (newQuote) => {
      const quotes = queryClient.getQueryData(["quotes"]);
      queryClient.setQueryData(["quotes"], quotes.concat(newQuote));
      const id = Math.floor(Math.random() * 1000000);
      notificationHandler({
        content: `new quote '${newQuote.content}' created`,
        id,
      });
    },
    onError: (error) => {
      const id = Math.floor(Math.random() * 1000000);
      notificationHandler({
        content: error.response.data.error,
        id,
      });
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    createQuoteMutation.mutate({ content, votes: 0 });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default QuoteForm;
