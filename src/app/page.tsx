"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, Brain, Bot, Calendar, ChevronRight, Github, Terminal, Rocket, Timer, Award, Zap } from 'lucide-react';
import DayNightToggleButton from "@/components/ui/dark-mode-button";
import FeatureCard from "@/components/FeatureCard";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const jokes = [
  "Why did the competitive programmer go broke? Because they used up all their cache! 💸",
  "What's a competitive programmer's favorite dance? Binary shuffle! 💃",
  "How many competitive programmers does it take to change a light bulb? , None! That's a hardware issue, not our problem! 😤",
  "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'",
  "Why was the competitive programmer stuck in the shower? The instructions said lather, rinse, O(n log n)! 🚿",
  "What's a competitive programmer's favorite snack? Binary cookies and boolean tea! 🍪",
  "Why did the CP student bring a ladder to practice? They heard the competition had array climbing! 🪜",
  "What's a competitive programmer's favorite movie? Runtime of Thrones! 🎬",
  "Why don't competitive programmers like nature? Too many tree traversal problems! 🌳",
  "How do competitive programmers stay fit? They do binary searches! 💪",
  "What's a competitive programmer's favorite game? Hide and hash! 🎮",
  "Why did the programmer bring a dictionary to the contest? To avoid undefined behavior! 📖",
  "Why did the competitive programmer refuse to take a break? They were afraid of losing their stack! 🏋️‍♂️",
  "What's the competitive programmer's favorite season? Fall, because it means stack overflow! 🍂",
  "Why do competitive programmers love recursion? Because it’s always calling them back! 🔄",
  "How does a competitive programmer fix a broken heart? With a bit of binary love! ❤️",
  "Why did the algorithm go to therapy? It had too many unresolved loops! 🔄",
  "What did the competitive programmer say at the gym? 'I'm here to work on my core (algorithm) strength!' 🏋️",
  "Why did the competitive programmer get a promotion? Their performance was off the charts (and complexity)! 📈",
  "What's a competitive programmer's favorite board game? Settlers of Catan... O(n) times! 🎲",
  "Why did the code cross the road? To debug the chicken on the other side! 🐔",
  "What's a competitive programmer's dream vacation? A trip to the land of unlimited loops! 🏝",
  "Why was the competitive programmer always calm? Because they could always catch exceptions! 😌",
  "What's a competitive programmer's favorite pet? A pointer, because it's always pointing in the right direction! 🐕",
  "Why did the programmer write bad poetry? They forgot to terminate their lines! ✍️",
  "How do competitive programmers cheer up their friends? They give them a little boost (of recursion)! 😄",
  "Why do competitive programmers never get lost? They always follow the algorithm! 🗺",
  "What do competitive programmers call their favorite band? The Syntax Errors! 🎸",
  "Why did the programmer get arrested? For breaking into a cache! 🚨",
  "How does a competitive programmer stay organized? With a well-structured array! 📚",
  "What's a competitive programmer's favorite drink? Java, of course! ☕",
  "Why was the programmer bad at sports? They always got caught in an infinite loop! 🏃",
  "What's a competitive programmer's favorite dessert? Pi, because it's irrational! 🥧",
  "How do competitive programmers measure success? In Big O, not Big U! 📏",
  "What did the algorithm say to the loop? 'I just can't break out of you!' 🔄",
  "Why did the competitive programmer join a band? They had a knack for binary rhythms! 🎵",
  "What's a competitive programmer's favorite breakfast? Hash browns and scrambled code! 🍳",
  "Why did the CP student bring extra coffee? For extra debugging energy! ☕",
  "What's the competitive programmer's favorite holiday? Pi Day, because it's deliciously infinite! 🥧",
  "Why was the programmer always invited to parties? Because they brought the best code snippets! 🎉",
  "How do competitive programmers solve conflicts? With a merge sort! 🔀",
  "What's a competitive programmer's favorite magical creature? A sorting unicorn! 🦄",
  "Why did the code refuse to compile? It was suffering from unresolved dependencies! 🚫",
  "What's a competitive programmer's favorite exercise? Running recursive sprints! 🏃‍♂️",
  "How do you comfort a competitive programmer? Tell them it's just a minor bug! 🐞",
  "Why did the programmer always smile? Because they found joy in every line of code! 😊",
  "What's a competitive programmer's go-to pickup line? 'Are you a binary search? Because I find you in logarithmic time!' 💕",
  "Why do competitive programmers make great detectives? They always look for the hidden bugs! 🕵️",
  "What's a competitive programmer's favorite musical note? C# (see sharp)! 🎶",
  "Why did the CP student stay up all night? They were debugging their dreams! 🌙",
  "What's a competitive programmer's secret weapon? A well-timed break statement! ⏸",
  "How do competitive programmers celebrate success? They throw a code party! 🎊",
  "Why did the programmer refuse to use stairs? They preferred escalators with constant time complexity! ⏩",
  "What's a competitive programmer's favorite snack at midnight? A slice of byte! 🍰",
  "Why do competitive programmers love solving puzzles? Because every problem is a piece of code! 🧩",
  "What's a competitive programmer's favorite type of tree? A binary tree, obviously! 🌲",
  "Why did the programmer go to the casino? To try their luck with random number generation! 🎰",
  "How do competitive programmers relax? They unwind by debugging their favorite code! 😌",
  "What's the competitive programmer's favorite exercise? Looping around the park! 🔄",
  "Why did the programmer buy new shoes? To improve their run-time performance! 👟",
  "What's a competitive programmer's favorite car? A Bugatti, because it's fast and bug-free! 🚗",
  "Why do competitive programmers love rock climbing? They enjoy scaling problems! 🧗",
  "What's a competitive programmer's favorite pizza topping? Extra loops and conditions! 🍕",
  "How do competitive programmers take notes? In pseudo-code, of course! 📝",
  "Why did the programmer get sunburned? They forgot to apply their algorithmic sunscreen! ☀️",
  "What's a competitive programmer's favorite card game? Go Fish, but with pointers! 🃏",
  "Why did the CP student always carry a notebook? For jotting down algorithm inspirations! 📓",
  "What's a competitive programmer's favorite drink at parties? A cold brew with extra caffeine, for infinite loops! 🥤",
  "How do competitive programmers say goodbye? 'See you in the next iteration!' 👋",
  "Why did the programmer get a pet snake? Because it was an excellent 'adder'! 🐍",
  "What's a competitive programmer's favorite board game? Code Clue, where every move is a debug! 🔍",
  "Why do competitive programmers love winter? Because it’s the perfect time for cool algorithms! ❄️",
  "What's a competitive programmer's favorite instrument? The loop-de-loop guitar! 🎸",
  "How does a competitive programmer prefer their steak? Well-done, just like their code! 🥩",
  "Why did the programmer get into gardening? They wanted to cultivate some new arrays! 🌱",
  "What's a competitive programmer's favorite sitcom? 'The Big Bang Theory', because of the big O jokes! 📺",
  "Why did the CP student bring a broom? To sweep up stray semicolons! 🧹",
  "What's a competitive programmer's secret to a good life? Debug often, and never fear the null! 🔧",
  "How do competitive programmers keep their hair in place? With CSS—Cascading Style Sheets! 💇",
  "What's a competitive programmer's favorite kind of music? Algo-rhythm and blues! 🎤",
  "Why did the programmer attend the comedy show? They heard it was full of stand-up scripts! 😂",
  "What's a competitive programmer's favorite sport? Stack ball—where every catch is a break! 🏀",
  "How does a competitive programmer propose? With a perfectly timed algorithm! 💍",
  "Why do competitive programmers never lose at chess? They always think several moves ahead! ♟",
  "What's a competitive programmer's favorite type of coffee? Espresso, because it's fast and strong! ☕",
  "How do competitive programmers handle failure? They simply iterate until they succeed! 🔁",
  "Why did the programmer take up photography? To capture the perfect snapshot of their code! 📸",
  "What's a competitive programmer's favorite holiday treat? A well-baked algorithm cake! 🍰",
  "Why do competitive programmers prefer online dating? Because they always search for a match! ❤️",
  "How do competitive programmers show affection? They give each other warm 'null' hugs! 🤗",
  "What's a competitive programmer's favorite outdoor activity? Debugging in the great outdoors! 🌳",
  "Why did the programmer write a self-help book? To guide others through their error-prone journey! 📖",
  "What's a competitive programmer's favorite magic trick? Making bugs disappear with a single command! ✨",
  "How do competitive programmers enjoy a rainy day? By staying in and refactoring their code! ☔",
  "What's a competitive programmer's favorite social media platform? GitHub, because it's all about collaboration! 🤝",
  "Why did the CP student carry a water bottle? To stay hydrated while running their code marathons! 💧",
  "What's a competitive programmer's favorite type of workout? Circuit training, because it's all about loops! 🔄",
  "How do competitive programmers plan their vacations? They map out every detail with precision! 🗺",
  "Why did the programmer attend a meditation class? To clear their mind and debug their thoughts! 🧘",
  "What's a competitive programmer's favorite type of art? Abstract, because it doesn't follow strict patterns! 🎨",
  "How do competitive programmers deal with traffic jams? They optimize their route and debug the delays! 🚦"
];

const Quotes = [
  "There are only two kinds of programming languages: those people always complain about and those nobody uses. — Bjarne Stroustrup",
  "Programming is like writing a book… except if you miss a single comma on page 126, the whole thing makes no sense. — Unknown",
  "The only valid measurement of code quality is the number of WTFs per minute. — Tom Van Vleck",
  "If debugging is the process of removing bugs, then programming must be the process of putting them in. — Edsger Dijkstra",
  "A good programmer is someone who looks both ways before crossing a one-way street. — Doug Linder",
  "The best code is no code at all. — Jeff Atwood",
  "The problem with troubleshooting is that trouble shoots back. — Unknown",
  "Simplicity is the soul of efficiency. — Austin Freeman",
  "The best thing about a boolean is even if you are wrong, you are only off by a bit. — Unknown",
  "Weeks of coding can save you hours of planning. — Unknown"
];

const streakMessages = [
  "Challenge yourself to go beyond! 🚀 Stay consistent and see how far you can push your problem-solving skills.",
  "Every streak counts! 🔥 Keep the momentum going—small daily efforts lead to big improvements.",
  "Stay committed, stay sharp! 💡 A strong streak builds strong problem-solving instincts.",
  "Can you set a new record? 🏆 The longer you go, the better you get. Keep solving, keep growing!",
  "Mastery is built one day at a time! ⏳ Challenge yourself to stay on track and improve every single day.",
  "Great coders aren’t born; they are made through daily practice! 💪 Keep grinding, keep growing.",
  "Consistency beats intensity! ⚡ Solve problems daily, and you’ll surprise yourself with progress.",
  "Your streak isn’t just a number—it’s proof of your dedication! 🔥 Keep going and reach new heights.",
  "Break limits, not streaks! 🚀 Each day brings you closer to mastery. Stay on course!",
  "The best way to get better is to never stop! 🎯 Keep your streak alive and see the magic happen."
];

function App() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [jokeIndex, setJokeIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode state based on theme
  useEffect(() => {
    setIsDarkMode(theme === 'dark');
  }, [theme]);

  // Toggle dark mode handler
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    setTheme(newDarkMode ? 'dark' : 'light');
  };

  const rotateJokes = () => {
    setJokeIndex((prev) => (prev + 1) % jokes.length);
  };

  const rotateQuotes = () => {
    setQuoteIndex((prev) => (prev + 1) % Quotes.length);
  }

  const rotateStreak = () => {
    setStreak((prev) => (prev + 1) % streakMessages.length);
  }

  const handleGetStarted = () => {
    router.push("/sign-up");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary transition-colors duration-300">
      
      {/* Fun Quote Banner */}
      <div className="bg-primary/5 py-3 px-4 text-center cursor-pointer" onClick={rotateJokes}>
        <p className="text-sm font-mono typing-effect">{jokes[jokeIndex]}</p>
        <p className="text-xs text-muted-foreground mt-1">Click for more programming humor! We've got 99+ jokes, but a bug ain't one! 😉</p>
      </div>
      
      {/* Sticky dark mode toggle button */}
      <div className="fixed top-4 right-4 z-50 shadow-md rounded-full">
        <DayNightToggleButton dark={isDarkMode} setDark={toggleDarkMode} />
      </div>
      
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 flex flex-col items-center text-center gap-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full animate-float">
          <Badge variant="secondary" className="bg-primary text-primary-foreground">New</Badge>
          <span className="text-sm">Your CP journey begins here! No more tutorial hell! 🚀</span>
        </div>

        <Badge className="w-fit animate-bounce" variant="outline">
                  <Zap className="h-3 w-3 mr-1" />
                  For CodeForces Beginners
                </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold gradient-text animate-slide-in">
              Everything you need to excel at CP! 🏆
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl animate-slide-in [animation-delay:200ms]">
            Pravah provides all the tools you need to start and maintain your competitive programming journey. No more navigating complex UIs or juggling templates. Pravah streamlines the competitive programming experience.✨
        </p>
        <p className="text-sm italic">Because let's face it, competitive programming is hard enough already!</p>
        <div className="bg-primary/5 py-3 px-4 text-center cursor-pointer" onClick={rotateQuotes}>
          <p className="text-sm italic border-l-2 border-primary pl-2 mt-2">
              {Quotes[quoteIndex]}
          </p>
        </div>
        
        
        <div className="flex gap-4 mt-4 animate-slide-in [animation-delay:400ms]">
          <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 group" onClick={handleGetStarted}>
            Get Started <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="gap-2 group" 
            onMouseEnter={() => setShowEasterEgg(true)}
            onMouseLeave={() => setShowEasterEgg(false)}>
            <Github className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            {showEasterEgg ? "Star us maybe? We're shy! 🥺" : "View on GitHub"}
          </Button>
        </div>
      </header>

      {/* streak */}
 
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <FeatureCard
                icon={<Calendar className="h-8 w-8 text-primary" />}
                title="Problem of the Day"
                description="Daily curated problems to maintain consistency and gradually improve your skills."
                funFact="Fun fact: 90% of our users who solve POTD for 30 days straight report significant improvement in their ratings!"
              />
              <FeatureCard
                icon={<Code2 className="h-8 w-8 text-primary" />}
                title="Personalized IDE"
                description="Built-in templates and a clean interface to focus on solving problems, not setting up your environment."
                funFact="Because life's too short to write the same boilerplate code over and over again."
              />
              <FeatureCard
                icon={<Bot className="h-8 w-8 text-primary" />}
                title="AI Debugging Assistant"
                description="Get help with debugging and understanding concepts with our personalized AI chatbot."
                funFact="It's like having a genius friend who never gets tired of your questions. Ever."
              />
            </div> 

            <div className="flex items-center justify-center px-4">
  <div className="relative w-full max-w-4xl h-[400px] overflow-hidden rounded-xl border bg-background shadow-xl hover:shadow-2xl transition-shadow">
    <div className="absolute inset-0 flex flex-col">
      {/* Header */}
      <div className="flex h-10 items-center border-b bg-muted/50 px-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <div className="ml-4 text-sm font-medium">Pravah IDE</div>
      </div>
      
      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Code Editor */}
        <div className="w-1/2 border-r bg-muted/20 p-4 font-mono text-sm">
          <div className="text-muted-foreground"># Template: C++</div>
          <div className="mt-2">
            <div className="text-blue-600">{"#include <bits/stdc++.h>"}</div>
            <div className="text-blue-600">{"using namespace std;"}</div>
            <div className="mt-2">
              <div>{"int main() {"}</div>
              <div className="pl-4">{"ios_base::sync_with_stdio(false);"}</div>
              <div className="pl-4">{"cin.tie(NULL);"}</div>
              <div className="pl-4 text-green-600 animate-pulse">{"// Your code here"}</div>
              <div className="pl-4">{"return 0;"}</div>
              <div>{"}"}</div>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="w-1/2 p-4">
          <div className="font-medium">Problem: Two Sum</div>
          <div className="mt-2 text-sm text-muted-foreground">
            Given an array of integers nums and an integer target, return indices of the two numbers such
            that they add up to target.
          </div>
          <div className="mt-4">
            <div className="text-sm font-medium">Test Cases</div>
            <div className="mt-1 rounded-md bg-muted p-2 text-sm font-mono">
              <div>Input: [2,7,11,15], target = 9</div>
              <div>Output: [0,1]</div>
            </div>
          </div>
          <div className="mt-4 p-2 bg-primary/10 rounded-md">
            <div className="text-xs font-medium text-primary">Pravah AI Hint:</div>
            <div className="text-xs mt-1">Try using a hash map to store values you've seen so far...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
      <br />
      <br />
      <br />
      <section className="container mx-auto px-4 py-16">
  <Card className="p-8 text-center bg-gradient-to-r from-primary/10 via-transparent to-primary/10 animate-slide-in hover:shadow-2xl transition-all duration-300">
    <h2 className="text-3xl font-bold mb-4">Build Your Streak, Build Your Skills</h2>

    {/* Streak Counter */}
    <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className={`h-8 w-8 rounded-md flex items-center justify-center text-xs font-medium transition-all hover:scale-110 ${
            i < 15
              ? "bg-primary text-primary-foreground"
              : i === 15
              ? "bg-primary/50 text-primary-foreground animate-pulse"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {i + 1}
        </div>
      ))}
    </div>

    {/* Streak Motivation Message */}
    <div className="max-w-lg w-full bg-muted/20 py-3 px-4 mt-6 text-center rounded-md cursor-pointer" onClick={rotateStreak}>
      <p className="text-sm italic border-l-2 border-primary pl-2">
        {streakMessages[streak]}
      </p>
    </div>
  </Card>
</section>




      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="p-8 text-center bg-gradient-to-r from-primary/10 via-transparent to-primary/10 animate-slide-in hover:shadow-2xl transition-all duration-300">
          <h2 className="text-3xl font-bold mb-4">Ready to Level Up Your CP Game? 🎮</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          "Join thousands of developers who went from 'What's a Fenwick Tree?' to 'Give me a whiteboard, I'll explain in log(n)!'"
            <br />
            <span className="text-sm mt-2 block">Future you will thank present you for clicking that button below.</span>
          </p>
          <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 animate-float group" onClick={handleGetStarted}>
            Start Your Journey <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground">© 2024 Pravah. Made with 💖 and approximately 1,287 cups of ☕</p>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">About</Button>
            <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">Blog</Button>
            <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">Contact</Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;