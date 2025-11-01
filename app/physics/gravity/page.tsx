"use client"

export default function GravityPage() {
  return (
    <div className="h-screen w-full">
      <iframe 
        src="https://lab.nationalmedals.org/gravity.php?gad_source=1&gad_campaignid=14129704244&gbraid=0AAAAACJSddZpObbJv08xfmrNRLtDd8P9G&gclid=Cj0KCQjw35bIBhDqARIsAGjd-caU7SXBOGUsk0ioaMuTR4uhGv5MGPlnrOA7BjKhdQZRDVyL5MnK2b0aAvZHEALw_wcB"
        title="Interactive Gravity Simulation"
        className="w-full h-full border-none"
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  )
}