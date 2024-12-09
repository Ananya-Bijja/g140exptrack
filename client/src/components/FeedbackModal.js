// // // // // // import React, { useState } from 'react';
// // // // // // import '../styles/FeedbackModal.css'; // Custom styles for the modal

// // // // // // const FeedbackModal = ({ onClose }) => {
// // // // // //   const [feedback, setFeedback] = useState('');
// // // // // //   const [rating, setRating] = useState(0);

// // // // // //   const handleSubmit = () => {
// // // // // //     if (!feedback || rating === 0) {
// // // // // //       alert('Please provide both feedback and a rating.');
// // // // // //       return;
// // // // // //     }

// // // // // //     // Send feedback to the server
// // // // // //     fetch('/api/submit-feedback', {
// // // // // //       method: 'POST',
// // // // // //       headers: { 'Content-Type': 'application/json' },
// // // // // //       body: JSON.stringify({ feedback, rating }),
// // // // // //     })
// // // // // //       .then((res) => res.json())
// // // // // //       .then((data) => {
// // // // // //         alert(data.message || 'Feedback submitted successfully!');
// // // // // //         onClose(); // Close the modal
// // // // // //       })
// // // // // //       .catch((error) => alert('Error submitting feedback: ' + error.message));
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className="feedback-modal">
// // // // // //       <div className="modal-content">
// // // // // //         <h2>Feedback</h2>
// // // // // //         <textarea
// // // // // //           placeholder="Write your feedback here..."
// // // // // //           value={feedback}
// // // // // //           onChange={(e) => setFeedback(e.target.value)}
// // // // // //         ></textarea>
// // // // // //         <div className="rating">
// // // // // //           {[...Array(5)].map((_, i) => (
// // // // // //             <span
// // // // // //               key={i}
// // // // // //               className={`star ${i < rating ? 'selected' : ''}`}
// // // // // //               onClick={() => setRating(i + 1)}
// // // // // //             >
// // // // // //               ★
// // // // // //             </span>
// // // // // //           ))}
// // // // // //         </div>
// // // // // //         <div className="modal-actions">
// // // // // //           <button className="btn btn-primary" onClick={handleSubmit}>
// // // // // //             Submit
// // // // // //           </button>
// // // // // //           <button className="btn btn-secondary" onClick={onClose}>
// // // // // //             Cancel
// // // // // //           </button>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default FeedbackModal;
// // // // // import React, { useState } from 'react';
// // // // // import '../styles/FeedbackModal.css'; // Custom styles for the modal

// // // // // const FeedbackModal = ({ onClose }) => {
// // // // //   const [feedback, setFeedback] = useState('');
// // // // //   const [rating, setRating] = useState(0);

// // // // //   const handleSubmit = () => {
// // // // //     if (!feedback || rating === 0) {
// // // // //       alert('Please provide both feedback and a rating.');
// // // // //       return;
// // // // //     }

// // // // //     fetch('http://localhost:5000/api/submit-feedback', {
// // // // //       method: 'POST',
// // // // //       headers: { 'Content-Type': 'application/json' },
// // // // //       body: JSON.stringify({ feedbackText: feedback, rating }),
// // // // //     })
// // // // //       .then((res) => res.json())
// // // // //       .then((data) => {
// // // // //         alert(data.message || 'Feedback submitted successfully!');
// // // // //         onClose();
// // // // //       })
// // // // //       .catch((error) => alert('Error submitting feedback: ' + error.message));
// // // // //   };

// // // // //   return (
// // // // //     <div className="feedback-modal">
// // // // //       <div className="modal-content">
// // // // //         <h2>Feedback</h2>
// // // // //         <textarea
// // // // //           placeholder="Write your feedback here..."
// // // // //           value={feedback}
// // // // //           onChange={(e) => setFeedback(e.target.value)}
// // // // //         ></textarea>
// // // // //         <div className="rating">
// // // // //           {[...Array(5)].map((_, i) => (
// // // // //             <span
// // // // //               key={i}
// // // // //               className={`star ${i < rating ? 'selected' : ''}`}
// // // // //               onClick={() => setRating(i + 1)}
// // // // //             >
// // // // //               ★
// // // // //             </span>
// // // // //           ))}
// // // // //         </div>
// // // // //         <div className="modal-actions">
// // // // //           <button className="btn btn-primary" onClick={handleSubmit}>
// // // // //             Submit
// // // // //           </button>
// // // // //           <button className="btn btn-secondary" onClick={onClose}>
// // // // //             Cancel
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default FeedbackModal;
// // // // import React, { useState } from 'react';
// // // // import '../styles/FeedbackModal.css'; // Custom styles for the modal

// // // // const FeedbackModal = ({ onClose }) => {
// // // //   const [feedback, setFeedback] = useState('');
// // // //   const [rating, setRating] = useState(0);

// // // //   const handleSubmit = () => {
// // // //     if (!feedback || rating === 0) {
// // // //       alert('Please provide both feedback and a rating.');
// // // //       return;
// // // //     }

// // // //     fetch('http://localhost:5000/api/submit-feedback', {
// // // //       method: 'POST',
// // // //       headers: { 'Content-Type': 'application/json' },
// // // //       body: JSON.stringify({ feedbackText: feedback, rating }),
// // // //     })
// // // //       .then((res) => res.json())
// // // //       .then((data) => {
// // // //         alert(data.message || 'Feedback submitted successfully!');
// // // //         onClose();
// // // //       })
// // // //       .catch((error) => alert('Error submitting feedback: ' + error.message));
// // // //   };

// // // //   return (
// // // //     <div className="feedback-modal">
// // // //       <div className="modal-content">
// // // //         <h2>Feedback</h2>
// // // //         <textarea
// // // //           placeholder="Write your feedback here..."
// // // //           value={feedback}
// // // //           onChange={(e) => setFeedback(e.target.value)}
// // // //         ></textarea>
// // // //         <div className="rating">
// // // //           {[...Array(5)].map((_, i) => (
// // // //             <span
// // // //               key={i}
// // // //               className={`star ${i < rating ? 'selected' : ''}`}
// // // //               onClick={() => setRating(i + 1)}
// // // //             >
// // // //               ★
// // // //             </span>
// // // //           ))}
// // // //         </div>
// // // //         <div className="modal-actions">
// // // //           <button className="btn btn-primary" onClick={handleSubmit}>
// // // //             Submit
// // // //           </button>
// // // //           <button className="btn btn-secondary" onClick={onClose}>
// // // //             Cancel
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default FeedbackModal;
// // // import React, { useState } from 'react';
// // // import '../styles/FeedbackModal.css'; // Custom styles for the modal

// // // const FeedbackModal = ({ onClose }) => {
// // //   const [feedback, setFeedback] = useState('');
// // //   const [rating, setRating] = useState(0);

// // //   const handleSubmit = () => {
// // //     if (!feedback || rating === 0) {
// // //       alert('Please provide both feedback and a rating.');
// // //       return;
// // //     }

// // //     fetch('http://localhost:5000/api/submit-feedback', {
// // //       method: 'POST',
// // //       headers: { 'Content-Type': 'application/json' },
// // //       body: JSON.stringify({ feedbackText: feedback, rating }),
// // //     })
// // //       .then((res) => res.json())
// // //       .then((data) => {
// // //         alert(data.message || 'Feedback submitted successfully!');
// // //         onClose();
// // //       })
// // //       .catch((error) => alert('Error submitting feedback: ' + error.message));
// // //   };

// // //   return (
// // //     <div className="feedback-modal">
// // //       <div className="modal-content">
// // //         <button className="close-button" onClick={onClose}>
// // //           ×
// // //         </button>
// // //         <h2>We value your feedback</h2>
// // //         <textarea
// // //           placeholder="Write your feedback here..."
// // //           value={feedback}
// // //           onChange={(e) => setFeedback(e.target.value)}
// // //         ></textarea>
// // //         <div className="rating">
// // //           {[...Array(5)].map((_, i) => (
// // //             <span
// // //               key={i}
// // //               className={`star ${i < rating ? 'selected' : ''}`}
// // //               onClick={() => setRating(i + 1)}
// // //             >
// // //               ★
// // //             </span>
// // //           ))}
// // //         </div>
// // //         <div className="modal-actions">
// // //           <button className="btn btn-primary" onClick={handleSubmit}>
// // //             Submit
// // //           </button>
// // //           <button className="btn btn-secondary" onClick={onClose}>
// // //             Cancel
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default FeedbackModal;
// // import React, { useState } from 'react';
// // import '../styles/FeedbackModal.css'; // Custom styles for the modal

// // const FeedbackModal = ({ onClose }) => {
// //   const [feedback, setFeedback] = useState('');
// //   const [rating, setRating] = useState(0);

// //   const handleSubmit = () => {
// //     if (!feedback || rating === 0) {
// //       alert('Please provide both feedback and a rating.');
// //       return;
// //     }

// //     fetch('http://localhost:5000/api/submit-feedback', {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify({ feedbackText: feedback, rating }),
// //     })
// //       .then((res) => res.json())
// //       .then((data) => {
// //         alert(data.message || 'Feedback submitted successfully!');
// //         onClose();
// //       })
// //       .catch((error) => alert('Error submitting feedback: ' + error.message));
// //   };

// //   return (
// //     <div className="feedback-modal">
// //       <div className="modal-content">
// //         <button className="close-button" onClick={onClose}>
// //           &times;
// //         </button>
// //         <h2>We value your feedback</h2>
// //         <textarea
// //           placeholder="Write your feedback here..."
// //           value={feedback}
// //           onChange={(e) => setFeedback(e.target.value)}
// //         ></textarea>
// //         <div className="rating">
// //           {[...Array(5)].map((_, i) => (
// //             <span
// //               key={i}
// //               className={`star ${i < rating ? 'selected' : ''}`}
// //               onClick={() => setRating(i + 1)}
// //             >
// //               ★
// //             </span>
// //           ))}
// //         </div>
// //         <div className="modal-actions">
// //           <button className="btn btn-primary" onClick={handleSubmit}>
// //             Submit
// //           </button>
// //           <button className="btn btn-secondary" onClick={onClose}>
// //             Cancel
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default FeedbackModal;
// import React, { useState } from 'react';
// import '../styles/FeedbackModal.css'; // Custom styles for the modal

// const FeedbackModal = ({ onClose }) => {
//   const [feedback, setFeedback] = useState('');
//   const [rating, setRating] = useState(0);

//   const handleSubmit = () => {
//     if (!feedback || rating === 0) {
//       alert('Please provide both feedback and a rating.');
//       return;
//     }

//     fetch('http://localhost:5000/api/submit-feedback', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ feedbackText: feedback, rating }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         alert(data.message || 'Feedback submitted successfully!');
//         onClose();
//       })
//       .catch((error) => alert('Error submitting feedback: ' + error.message));
//   };

//   return (
//     <div className="feedback-modal">
//       <div className="modal-content">
//         <button className="close-button" onClick={onClose}>
//           &times;
//         </button>
//         <div className="inner-box">
//           <h2>We value your feedback</h2>
//           <textarea
//             placeholder="Write your feedback here..."
//             value={feedback}
//             onChange={(e) => setFeedback(e.target.value)}
//           ></textarea>
//           <div className="rating">
//             {[...Array(5)].map((_, i) => (
//               <span
//                 key={i}
//                 className={`star ${i < rating ? 'selected' : ''}`}
//                 onClick={() => setRating(i + 1)}
//               >
//                 ★
//               </span>
//             ))}
//           </div>
//           <div className="modal-actions">
//             <button className="btn btn-primary" onClick={handleSubmit}>
//               Submit
//             </button>
//             <button className="btn btn-secondary" onClick={onClose}>
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FeedbackModal;
import React, { useState } from 'react';
import '../styles/FeedbackModal.css'; // Custom styles for the modal

const FeedbackModal = ({ onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (!feedback || rating === 0) {
      alert('Please provide both feedback and a rating.');
      return;
    }

    fetch('http://localhost:5000/api/submit-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedbackText: feedback, rating }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || 'Feedback submitted successfully!');
        onClose();
      })
      .catch((error) => alert('Error submitting feedback: ' + error.message));
  };

  return (
    <div className="feedback-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="inner-box">
          <h2>We value your feedback</h2>
          <textarea
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
          <div className="rating">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`star ${i < rating ? 'selected' : ''}`}
                onClick={() => setRating(i + 1)}
              >
                ★
              </span>
            ))}
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
