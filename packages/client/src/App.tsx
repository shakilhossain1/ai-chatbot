import ReviewList from './components/reviews/ReviewList';

function App() {
  return (
    <div className="p-4 h-screen w-2xl mx-auto">
      {/* <Chatbot /> */}
      <ReviewList productId={1} />
    </div>
  );
}

export default App;
