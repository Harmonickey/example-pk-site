# PK Example Site

PK Example Site is an example Turn Key website built out by Power Kiosk.  It purely shows what the result of a simple site would be, and provides the front end source code to give you an idea of how it's built out.  This site is meant to be the most up to date version of how the Turn Keys are built, but not necessarily the bible for how we build out specific Turn Keys or our own flagship sites because they have different needs depending on the client on our internal processes.

## Installation

Use npm to install any required packages

```bash
npm install
```

## Code Language

Knockout.js  
https://knockoutjs.com/

The purpose of using this library is that is has the most compatability across various different platforms with little effort needed: Wordpress, flat websites, existing websites in various languages, and most CRMs.  Just drop the code in, and it works.  The most difficult part is getting the CSS to align, but we don't support that.

## Entry Point
Every starts at the bottom of index.html where it calls PowerKioskECommerce() which you can find in PowerKioskECommerce.js

That file builds out the knockout observables and calls any initial subroutines at the beginning to get the site up and running.  After that, multiple paths are taken in PowerKioskECommerce.js to control the flow of the SPA (Single Page Application) as it hides and shows various views.  All class objects are in their own files, but most logic is taken care of in PowerKioskECommerce.js.

You can start by viewing the click events in index.html to see where events are fired off, and noting any .subscirbe() in the javascript to see when certain change events are fired when the user modifies any fields.

https://powerkioskdirect.com is a live example of this code.

## Bundle

```bash
grunt
```

```bash
grunt test
```

This will output to dist, which is what we use to deploy to a Turn Key site.  We always deploy pk.min.js and pk.min.css to powerkioskdirect.com as a central location for all Turn Key sites to feed off from.  If there is an update to the code, all sites receive the update all at once.