export default mapDetectedMood = (textFeeling) => {
    const moodMap = {
      happy: [
        "😊","😄","😍","😁","😃","😸","😺","🥰","😻","🤣","😆","😎","😇","😹",
        "happy","joy","awesome","glad","cheerful","delighted","blissful","content",
        "ecstatic","overjoyed","satisfied","grateful","sunny","radiant","uplifted",
        "bubbly","elated","smiley","yay","woohoo","feeling good","on cloud nine",
        "bright","joyful","full of smiles","grinning","tickled pink","walking on sunshine"
      ],
      sad: [
        "😢","😭","😔","😞","😩","😿","💔","😒","😖","😟","😣","🥀","😫","😤","🥹",
        "broken","sad","miss","down","depressed","unhappy","gloomy","blue","heartbroken",
        "melancholy","tearful","miserable","lonely","hopeless","abandoned","isolated",
        "lost","moody","pain","sorrow","hurt","crushed","heavy heart","emotional wreck"
      ],
      energetic: [
        "💪","⚡","🔥","🏃‍♂️","🏋️‍♂️","🎯","🏃","🚴‍♂️","🏌️‍♂️","🏂","🚀","🧗","🥾","🏇",
        "energetic","active","hyped","pumped","charged","motivated","adrenaline",
        "dynamic","powerful","unstoppable","speed","running","jump","workout",
        "exercise","sporty","fit","training","explosive","bursting","ready to roll",
        "amped","all fired up","beast mode","hyper","revved up","full throttle"
      ],
      romantic: [
        "❤️","💖","💘","💌","😍","😘","💕","💑","💓","💞","💗","💋","🌹","🥰","💍","👩‍❤️‍👨","💏",
        "romantic","love","in love","crush","sweetheart","affection","flirt","darling",
        "honey","beloved","desire","infatuated","cupid","enchanted","smitten","passionate",
        "date","relationship","valentine","head over heels","taken","soulmate","together forever",
        "my person","heart skips a beat","butterflies","deeply connected","hopeless romantic"
      ],
      angry: [
        "😡","🤬","😠","💢","😤","👿","😾","🔥","angry","mad","furious","hate","rage","annoyed",
        "irritated","frustrated","pissed","outraged","resentful","grumpy","fed up","snapped",
        "agitated","provoked","disgusted","offended","fuming","hostile","irritation",
        "boiling","red with anger","lost my temper","seeing red","fit of rage","blazing mad"
      ],
      focused: [
        "🧠","💡","📚","📖","🖋️","🖊️","🔍","🖱️","focused","concentrated","studying","study","determined",
        "absorbed","mindful","sharp","alert","attentive","disciplined","working","productive",
        "goal-oriented","laser-focused","locked in","coding","reading","learning","deep work",
        "zero distraction","fully engaged","tunnel vision","in the zone","heads down","grinding"
      ],
      excited: [
        "🤩","🎉","🥳","🎊","🎈","😆","😃","😁","wow","excited","thrilled","pumped","enthusiastic",
        "ecstatic","buzzing","elated","overjoyed","fired up","lit","woohoo","hyped","can't wait",
        "stoked","so excited","psyched","electric","adrenaline rush","jumping","yippee","omg",
        "feeling pumped","wildly excited","buzzed","exhilarated","pumped up","super hyped"
      ],
      nostalgic: [
        "📻","🕰️","📼","📀","📷","📸","📼","nostalgic","missing","old days","memories","retro",
        "reminisce","flashback","childhood","golden days","past","classic","old school","vintage",
        "throwback","remember","recollection","time travel","deja vu","the good old days",
        "sentimental","memory lane","90s vibes","old is gold","revisit","good times"
      ],
      calm: [
        "😌","🧘‍♂️","🧘‍♀️","🌿","🏞️","🌄","relaxed","calm","peaceful","chill","soothing","serene",
        "zen","composed","still","restful","meditative","silent","tranquil","cozy","quiet","slow",
        "lowkey","laid back","unbothered","cool","comfy","balanced","unwind","breath deeply",
        "in peace","deep calm","peace vibes","inner peace","stable","grounded","centered"
      ],
      motivated: [
        "🏆","🔥","🥇","💪","🏅","🚀","🎯","📈","motivated","driven","inspired","ambitious","goal",
        "achieve","unstoppable","focused","passionate","dedicated","determined","hustle","grind",
        "discipline","vision","mission","effort","winning","commitment","growth","mindset",
        "success","level up","keep going","push through","self-belief","rise and grind",
        "make it happen","just do it","all in","one step closer"
      ],
      neutral: [
        "okay","alright","fine","meh","so-so","neutral","normal","average","nothing much","same old",
        "same as usual","just chilling","no particular feeling","middle of the road","balanced","okie",
        "unbothered","casual","regular day","not bad","no emotions","meh vibes","feeling nothing"
      ]
    };
  
    for (const textmood in moodMap) {
      if (
        moodMap[textmood].some((keyword) =>
          textFeeling.toLowerCase().includes(keyword.toLowerCase())
        )
      ) {
        return textmood;
      }
    }
  
    return "neutral"; // Default to neutral if no mood is matched
  };
  