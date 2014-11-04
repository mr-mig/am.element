Structural abstraction for ambitious framework.

Built on top of AngularJS.

Represents a low-level 'widget'.  
Consists of a directive with isolated scope + state + channel.


## What is 'element'?

Element is a low-level building block for web components.

It is represented by a custom tag in the markup with `state` and `channel` attributes:

```html
<my-element state="elState" channel="reactionChannel"></my-element>
```

Element is an interactive piece of the screen with fully incapsulated behaviour.

## How do I use it?

The usecases are somthing like:
- search box
- tab
- user avatar
- user details form 
- ...

The main idea is that **element NEVER interacts with other elements DIRECTLY. It only changes it's state**.

## Conventions
* Element MUST have some `state` (controlled by framework, fallback to a default empty object state)
* Element MUST bind it's state to some namespace through HTML `state` attribute (controlled by user)  
```html
<!-- incorrect -->
<my-element></my-element>
```
* Element MUST change only it's `state` (controlled by user)
* Element CAN react on channel signals (controlled by framework)
* Element CAN omit channel binding through HTML `channel` attribute
* Element SHOULD provide the API with *scope attributes*.
