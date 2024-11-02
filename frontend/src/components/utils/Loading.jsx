export default function Loading(){
    return <div>
    <div className="mb-4 mt-20 flex justify-center">
      <div className="loader"></div> {/* Display the circular spinner */}
    </div>
    <p className="mb-4 flex justify-center">Loading... Please wait!</p>
  </div>
}