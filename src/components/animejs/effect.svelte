<script lang="ts">
  import { animate, text, stagger } from "animejs";

  let el = $state<HTMLElement | null>(null);

  $effect(() => {
    if (el) {
      const { chars } = text.split(el, {
        chars: true,
      });

      animate(chars, {
        delay: stagger(50),
        y: [30, 0],
        loop: true,
        duration: 300,
        loopDelay: 1000,
        alternate: true,
      });
    }
  });
</script>

<div class="text-xl" bind:this={el}>Hello World</div>
