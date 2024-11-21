import './landing.css';
import Link from 'next/link';
export default function Header() {
  return (
    <div className="font w-full bg-stone-50 flex flex-col gap-7 items-center">
      <p className="text-3xl mt-5 lg:text-7xl !leading-tight mx-auto max-w-xl text-center">
        The <span className="fancy-font">Everything</span> Calendar{" "}
      </p>
      <p className="typewriter"> Like the Everything Bagel, but for your day :) </p>
      <Link href="/sign-up">
        <button className="events-btn">Sign Up</button>
      </Link>
    
    <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    
      
      
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      
    </div>
  );
}
