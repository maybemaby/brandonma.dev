<script lang="ts">
  import { type Attachment } from "svelte/attachments";
  import { animate, stagger } from "animejs";

  let show = $state(true);

  const animeAttachment: Attachment = (el) => {
    animate(el.children, {
      y: [100, 0],
      x: stagger(150, { start: -350 }),
      opacity: [0, 1],
      scale: [0.5, 1],
      duration: 1000,
      delay: stagger(500),
      loop: true,
      loopDelay: 1000,
    });
  };
</script>

{#if show}
  <div class="relative" {@attach animeAttachment}>
    {#each { length: 5 } as _, idx}
      <div class="bg-white p-3 rounded-md w-[100px] h-[80px] absolute">
        Card {idx}
      </div>
    {/each}
  </div>
{/if}
