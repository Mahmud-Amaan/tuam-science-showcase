"use client"

export default function NeuralNetworksPage() {
  return (
    <div className="h-screen w-full">
      <iframe 
        src="https://playground.tensorflow.org/#activation=tanh&batchSize=9&dataset=circle&regDataset=reg-plane&learningRate=0.03&regularizationRate=0&noise=0&networkShape=4,2,2,2,2&seed=0.10894&showTestData=false&discretize=false&percTrainData=60&x=true&y=true&xTimesY=true&xSquared=true&ySquared=true&cosX=false&sinX=true&cosY=false&sinY=true&collectStats=false&problem=classification&initZero=false&hideText=false"
        title="TensorFlow Neural Network Playground"
        className="w-full h-full border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}