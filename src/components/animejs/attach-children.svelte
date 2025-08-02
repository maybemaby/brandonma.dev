<script lang="ts">
  import { type Attachment } from "svelte/attachments";
  import { animate, stagger } from "animejs";

  const animeAttachment: Attachment = (el) => {
    animate(el.children, {
      y: [100, 0],
      x: stagger(80, { start: -250 }),
      rotate: stagger(10, { start: -20 }),
      opacity: [0, 1],
      scale: [0.5, 1],
      duration: 800,
      delay: stagger(500),
      loop: true,
      loopDelay: 1000,
    });
  };
</script>

<div class="relative" {@attach animeAttachment}>
  {#each { length: 5 } as _, idx}
    <div class="bg-white p-3 rounded-md w-[80px] h-[100px] absolute border">
      Card {idx}
    </div>
  {/each}
</div>
